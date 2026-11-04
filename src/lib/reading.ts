import { getCollection, type CollectionEntry } from 'astro:content';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';

export const READING_BASE = '/about/reading/';
export const READING_TITLE = "What I'm reading";
export const statusNames = { reading: 'Reading', paused: 'Paused', stopped: 'Stopped', finished: 'Finished' };
export type ReadingStatus = keyof typeof statusNames;
export type Progress = { percent: number; label: string };
type WorkEntry = CollectionEntry<'readingWorks'>;
type UpdateEntry = CollectionEntry<'readingUpdates'>;
type SessionData = WorkEntry['data']['sessions'][number];
export type ReadingUpdate = {
	entry: UpdateEntry;
	anchor: string;
	href: string;
	hasNote: boolean;
	preview: string;
	progress?: Progress;
};
export type ReadingSession = {
	data: SessionData;
	anchor: string;
	href: string;
	status: ReadingStatus;
	archiveDate?: string;
	updated?: string;
	progress?: Progress;
	updates: ReadingUpdate[];
};
export type ReadingWork = { entry: WorkEntry; href: string; sessions: ReadingSession[] };
type Node = { type: string; value?: string; children?: Node[] };
const parser = unified().use(remarkParse).use(remarkMdx);

function fail(entry: WorkEntry | UpdateEntry, message: string): never {
	throw new Error(`${entry.filePath ?? entry.id}: ${message}`);
}

function validDate(value: string, entry: WorkEntry | UpdateEntry) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) {
		fail(entry, `Invalid calendar date "${value}"; use a quoted YYYY-MM-DD date.`);
	}
	return value;
}

export function readingDate(date: string) {
	return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function text(node: Node): string {
	if (['mdxjsEsm', 'mdxTextExpression', 'mdxFlowExpression', 'code', 'inlineCode'].includes(node.type)) return '';
	if (node.type === 'text') return node.value ?? '';
	return (node.children ?? []).map(text).join('');
}

function firstParagraph(node: Node): string {
	if (node.type === 'paragraph') return text(node).replace(/\s+/g, ' ').trim();
	if (node.type.startsWith('mdx') || node.type === 'code') return '';
	for (const child of node.children ?? []) {
		const paragraph = firstParagraph(child);
		if (paragraph) return paragraph;
	}
	return '';
}

function note(entry: UpdateEntry) {
	const tree = parser.parse(entry.body ?? '') as Node;
	const hasNote = (tree.children ?? []).some(node => !['mdxjsEsm', 'definition'].includes(node.type));
	const words = firstParagraph(tree).split(/\s+/).filter(Boolean);
	const preview = entry.data.summary ?? (words.length ? words.slice(0, 40).join(' ') + (words.length > 40 ? '…' : '') : 'Read note');
	return { hasNote, preview };
}

function progress(data: UpdateEntry['data'], session: SessionData, entry: UpdateEntry): Progress | undefined {
	if (data.pages !== undefined && data.percent !== undefined) fail(entry, 'Use pages or percent, not both.');
	if (data.pages !== undefined) {
		if (!session.totalPages) fail(entry, 'Page progress requires totalPages on the session.');
		if (data.pages > session.totalPages) fail(entry, 'pages cannot exceed totalPages.');
		return { percent: Math.round(data.pages / session.totalPages * 100), label: `${data.pages} of ${session.totalPages} pages` };
	}
	if (data.percent !== undefined) {
		if (session.totalPages) fail(entry, 'Use pages for a session with totalPages.');
		return { percent: data.percent, label: `${data.percent}% complete` };
	}
}

export async function getReadingWorks(): Promise<ReadingWork[]> {
	const [works, updates] = await Promise.all([getCollection('readingWorks'), getCollection('readingUpdates')]);
	const workIds = new Set(works.map(work => work.id));
	const updateIds = new Set<string>();
	for (const update of updates) {
		if (updateIds.has(update.id)) fail(update, `Duplicate update ID "${update.id}".`);
		updateIds.add(update.id);
		if (!workIds.has(update.id.split('/')[0])) fail(update, 'No work.md exists for this update.');
		const name = update.id.split('/').at(-1)!;
		if (!/^\d{4}-\d{2}-\d{2}-\d{2,}$/.test(name) || !name.startsWith(`${update.data.date}-`)) {
			fail(update, 'Name updates YYYY-MM-DD-01.mdx, matching the date field.');
		}
		validDate(update.data.date, update);
	}
	return works.map(entry => {
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) fail(entry, 'Use a lowercase, hyphenated work folder name.');
		const href = `${READING_BASE}${entry.id}/`;
		const ids = new Set<string>();
		const workUpdates = updates.filter(update => update.id.split('/')[0] === entry.id);
		for (const session of entry.data.sessions) {
			if (ids.has(session.id)) fail(entry, `Duplicate session ID "${session.id}".`);
			ids.add(session.id);
		}
		for (const update of workUpdates) {
			if (!ids.has(update.data.session)) fail(update, `Unknown session "${update.data.session}".`);
		}
		let previousEnd: string | undefined;
		let previousStart: string | undefined;
		const sessions = entry.data.sessions.map((data, index): ReadingSession => {
			const started = data.started ? validDate(data.started, entry) : undefined;
			if (started && ((previousStart && started < previousStart) || (previousEnd && started < previousEnd))) {
				fail(entry, `Session "${data.id}" must start after the preceding session.`);
			}
			let status: ReadingStatus = 'reading';
			let archiveDate: string | undefined;
			let currentProgress: Progress | undefined;
			const anchor = `session-${data.id}`;
			const ordered = workUpdates.filter(update => update.data.session === data.id)
				.sort((a, b) => a.data.date.localeCompare(b.data.date) || a.id.localeCompare(b.id, 'en', { numeric: true }));
			const sessionUpdates: ReadingUpdate[] = [];
			for (const update of ordered) {
				const date = update.data.date;
				if (started && date < started) fail(update, 'An update cannot precede its session start.');
				if (previousEnd && date < previousEnd) fail(update, 'This session overlaps the preceding session.');
				const content = note(update);
				const nextProgress = progress(update.data, data, update);
				if (!content.hasNote && !nextProgress && !update.data.status) fail(update, 'An update needs progress, a status change, or note content.');
				if (status === 'stopped' || status === 'finished') {
					if (update.data.status || nextProgress) fail(update, 'Closed sessions accept notes only; returning requires a new session.');
				}
				if (update.data.status) {
					if (update.data.status === status) fail(update, `The session is already ${status}; omit the redundant status.`);
					status = update.data.status;
					archiveDate = status === 'reading' ? undefined : date;
				}
				if (nextProgress) currentProgress = nextProgress;
				const updateAnchor = `update-${update.id.split('/').at(-1)}`;
				sessionUpdates.push({ entry: update, anchor: updateAnchor, href: `${href}#${updateAnchor}`, ...content, progress: nextProgress });
			}
			if (index < entry.data.sessions.length - 1 && status !== 'stopped' && status !== 'finished') {
				fail(entry, `Close session "${data.id}" before adding another session.`);
			}
			previousEnd = archiveDate;
			previousStart = started ?? previousStart;
			if (status === 'finished' && (currentProgress || data.totalPages)) {
				currentProgress = { percent: 100, label: data.totalPages ? `${data.totalPages} of ${data.totalPages} pages` : '100% complete' };
			}
			return { data, anchor, href: `${href}#${anchor}`, status, archiveDate, updated: ordered.at(-1)?.data.date ?? started, progress: currentProgress, updates: sessionUpdates.reverse() };
		});
		return { entry, href, sessions: sessions.reverse() };
	});
}

export function getReadingLists(works: ReadingWork[]) {
	const sessions = works.flatMap(work => work.sessions.map(session => ({ work, session })));
	const current = sessions.filter(({ session }) => session.status === 'reading')
		.sort((a, b) => (b.session.updated ?? '').localeCompare(a.session.updated ?? '') || a.work.entry.data.title.localeCompare(b.work.entry.data.title));
	const history = sessions.filter(({ session }) => session.status !== 'reading')
		.sort((a, b) => b.session.archiveDate!.localeCompare(a.session.archiveDate!) || a.work.entry.data.title.localeCompare(b.work.entry.data.title));
	const notes = sessions.flatMap(({ work, session }) => session.updates.filter(update => update.hasNote).map(update => ({ work, session, update })))
		.sort((a, b) => b.update.entry.data.date.localeCompare(a.update.entry.data.date) || b.update.entry.id.localeCompare(a.update.entry.id, 'en', { numeric: true }));
	return { current, history, notes };
}

export function getReadingFeedItems(works: ReadingWork[], site: URL) {
	return works.flatMap(work => work.sessions.flatMap(session => {
		const items = session.updates.filter(update => update.hasNote || update.entry.data.status).map(update => ({
			title: `${work.entry.data.title} — ${update.entry.data.status ? statusNames[update.entry.data.status] : 'Reading note'}`,
			pubDate: new Date(`${update.entry.data.date}T00:00:00Z`),
			description: update.hasNote ? update.preview : `${statusNames[update.entry.data.status!]} ${work.entry.data.title}.`,
			// Absolute URLs keep the RSS library from appending a slash to the anchor.
			link: new URL(update.href, site).href,
			customData: `<guid isPermaLink="false">reading:${work.entry.id}:${update.anchor}</guid>`,
		}));
		if (session.data.started) items.push({
			title: `${work.entry.data.title} — Started reading`,
			pubDate: new Date(`${session.data.started}T00:00:00Z`),
			description: `Started reading ${work.entry.data.title}.`,
			link: new URL(session.href, site).href,
			customData: `<guid isPermaLink="false">reading:${work.entry.id}:${session.anchor}</guid>`,
		});
		return items;
	})).sort((a, b) => +b.pubDate - +a.pubDate || a.link.localeCompare(b.link));
}
