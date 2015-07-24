/** 1コマを表す構造です。 */﻿
interface IFrame {
    theme1: ITheme;
    theme2: ITheme;
}

/** タイムテーブル案です。 */
interface IPlan {
    /** このタイムテーブル案に含まれる、コマの内容です(4コマ)。 */
    frames: IFrame[];
    /** このタイムテーブル案に参加できる人数をもとにしたスコアです。 */
    score?: number;
}

/** 1コマx2テーマを同時進行なので、テーマを2つ組みにしたコマの総組み合わせを作って返します。 */
function makeFrames(themes: ITheme[]): IFrame[] {
    var head = themes[0];
    var tails = themes.slice(1);
    var frames = tails.map(t => { return { theme1: head, theme2: t }; });
    if (tails.length == 1) return frames;

    var leftPairs = makeFrames(tails);
    return frames.concat(leftPairs);
}

/** 引数に渡されたタイムテーブル案が問題なければ true、
同じテーマがコマ違いで重複しているか、
又は同じコマ内なのにスピーカーが両方のテーマを担当している場合は false を返します。
タイムテーブル案の集合から、整合の取れていないものを filter() メソッドで除去するのに使います。
 */
function notDupulicated(plan: IPlan): boolean {
    var counter: any = {};
    var hasConflict = false;
    if (plan.frames.length != 4) throw ("E1:lengtyh is " + plan.frames.length);
    plan.frames.forEach(f => {
        var c1 = counter[f.theme1.title] || 0;
        var c2 = counter[f.theme2.title] || 0;
        counter[f.theme1.title] = c1 + 1;
        counter[f.theme2.title] = c2 + 1;
        if (c1 > 0 || c2 > 0) hasConflict = true;
        if (f.theme1.speaker == f.theme2.speaker) hasConflict = true;
    });

    return !hasConflict;
}

/** タイムテーブル案を、総組み合わせで生成する、中核の関数です。 */
function makePlansCore(frames: IFrame[], depth?: number): IPlan[] {
    depth = depth || 1;
    var head = frames[0];
    var tails = frames.slice(1);

    var nestedPlans: IPlan[][] = tails
        .map((t, i) => {
            if (depth == 2 || tails.length == 1) {
                return [{ frames: [head, t] }];
            }
            var moreTails = tails.slice(i + 1);
            var plans = makePlansCore(moreTails, depth + 1);
            return plans
                .map(plan => { return { frames: [head, t].concat(plan.frames) } });
        });

    var result: IPlan[] = [];
    nestedPlans.forEach(np => result = result.concat(np));
    return result;
}

/** タイムテーブル案を、総組み合わせで生成します。 */
function makePlans(frames: IFrame[]): IPlan[] {
    if (frames.length == 4) return makePlansCore(frames);
    return makePlansCore(frames).concat(makePlans(frames.slice(1)));
}

/** 1コマあたりのスコアを算定します。そのコマに投票し且つ参加できる人数がスコアの基本になります。 */
function calcScoreOfFrame(frame: IFrame) {
    var votes = [];
    var speakers = [frame.theme1.speaker, frame.theme2.speaker];
    var allVotes = frame.theme1.votes.concat(frame.theme2.votes);
    var conflictCount = 0;
    var conflictSpeakerCount = 0;
    allVotes
        .forEach(v => {
            // 同じコマ内で両方のテーマに投票していた場合は 2 ではなく 1 で数えられます。
            // スピーカー担当が、同じコマ内の他方のテーマに投票していた場合は、0 で数えられます。
            if (votes.indexOf(v) != -1) conflictCount++;
            if (speakers.indexOf(v) != -1) conflictSpeakerCount++;
            if (votes.indexOf(v) == -1 && speakers.indexOf(v) == -1) votes.push(v);
        });

    // 投票してて、且つ、参加できる人数をスコアとします。
    return votes.length
        
        // 以下のケースをどういうペナルティとするか試行錯誤...。
        // - ある同じコマ内で、スピーカーの自分担当の他方が、そのスピーカーが聴衆として参加したかったテーマであった場合
        // - 同じコマ内で、両方のテーマに投票していて、いずれか片方のみの参加を迫られる場合

        // 減点方式だと、ただ単に組み合わせが悪い案と同じレベルに成り下がってしまうだけなので、
        // そうではなく、ペナルティが発生していなければより望ましいということで加点方式にしてみる。
        //+ (conflictSpeakerCount == 0 ? +1 : 0)
        //+ (conflictCount == 0 ? +1 : 0)
        //- conflictSpeakerCount
        //- conflictCount
        ;
}

/** 1タイムテーブル案のスコアを返します。(そのタイムテーブル案が抱えるすべてのコマの各スコアの合計です) */
function calcScore(plan: IPlan) {
    plan.score = plan.frames
        .map(calcScoreOfFrame)
        .reduce((n, m) => n + m, 0);
}

module app {
    // 参考情報として、全投稿テーマを、投票の多い順にならべてコンソールに表示します。
    var sortedThemes = themes.sort((a, b) => b.votes.length - a.votes.length);
    console.log('[参考情報] 全投稿テーマを投票の多い順に並べ替えして以下に出力します。');
    console.dir(sortedThemes);

    // 全投稿テーマをもとに、総当たりでコマ(frame)のすべての組み合わせを生成します。
    var frames = makeFrames(themes);

    // さらにそのコマの集合をもとに、4コマの組み合わせ = タイムテーブル案を、総当たりで生成します。
    // そのうち、同じテーマが重複して現れていたり、同じスピーカーが同一時間に重複していたりする不整合をfilterで除外します。
    var plans = makePlans(frames)
        .filter(notDupulicated);

    // そうして求めたタイムテーブル案に、投票し且つ参加できる人数によるスコアを求めて score プロパティに設定します。
    plans.forEach(plan => calcScore(plan));

    // スコアの大きい順に並べ替えて、コンソールに表示します。
    plans = plans.sort((a, b) => b.score - a.score);
    console.log('----');
    console.log('以下に、スコアの高い順に、タイムテーブル案を出力します。');
    console.dir(plans);
}
