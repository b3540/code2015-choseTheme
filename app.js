/** 1コマx2テーマを同時進行なので、テーマを2つ組みにしたコマの総組み合わせを作って返します。 */
function makeFrames(themes) {
    var head = themes[0];
    var tails = themes.slice(1);
    var frames = tails.map(function (t) { return { theme1: head, theme2: t }; });
    if (tails.length == 1)
        return frames;
    var leftPairs = makeFrames(tails);
    return frames.concat(leftPairs);
}
/** 引数に渡されたタイムテーブル案が問題なければ true、
同じテーマがコマ違いで重複しているか、
又は同じコマ内なのにスピーカーが両方のテーマを担当している場合は false を返します。
タイムテーブル案の集合から、整合の取れていないものを filter() メソッドで除去するのに使います。
 */
function notDupulicated(plan) {
    var counter = {};
    var hasConflict = false;
    if (plan.frames.length != 4)
        throw ("E1:lengtyh is " + plan.frames.length);
    plan.frames.forEach(function (f) {
        var c1 = counter[f.theme1.title] || 0;
        var c2 = counter[f.theme2.title] || 0;
        counter[f.theme1.title] = c1 + 1;
        counter[f.theme2.title] = c2 + 1;
        if (c1 > 0 || c2 > 0)
            hasConflict = true;
        if (f.theme1.speaker == f.theme2.speaker)
            hasConflict = true;
    });
    return !hasConflict;
}
/** タイムテーブル案を、総組み合わせで生成する、中核の関数です。 */
function makePlansCore(frames, depth) {
    depth = depth || 1;
    var head = frames[0];
    var tails = frames.slice(1);
    var nestedPlans = tails
        .map(function (t, i) {
        if (depth == 2 || tails.length == 1) {
            return [{ frames: [head, t] }];
        }
        var moreTails = tails.slice(i + 1);
        var plans = makePlansCore(moreTails, depth + 1);
        return plans
            .map(function (plan) { return { frames: [head, t].concat(plan.frames) }; });
    });
    var result = [];
    nestedPlans.forEach(function (np) { return result = result.concat(np); });
    return result;
}
/** タイムテーブル案を、総組み合わせで生成します。 */
function makePlans(frames) {
    if (frames.length == 4)
        return makePlansCore(frames);
    return makePlansCore(frames).concat(makePlans(frames.slice(1)));
}
/** 1コマあたりのスコアを算定します。そのコマに投票し且つ参加できる人数がスコアの基本になります。 */
function calcScoreOfFrame(frame) {
    var votes = [];
    var speakers = [frame.theme1.speaker, frame.theme2.speaker];
    var allVotes = frame.theme1.votes.concat(frame.theme2.votes);
    var conflictCount = 0;
    var conflictSpeakerCount = 0;
    allVotes
        .forEach(function (v) {
        // 同じコマ内で両方のテーマに投票していた場合は 2 ではなく 1 で数えられます。
        // スピーカー担当が、同じコマ内の他方のテーマに投票していた場合は、0 で数えられます。
        if (votes.indexOf(v) != -1)
            conflictCount++;
        if (speakers.indexOf(v) != -1)
            conflictSpeakerCount++;
        if (votes.indexOf(v) == -1 && speakers.indexOf(v) == -1)
            votes.push(v);
    });
    // 投票してて、且つ、参加できる人数をスコアとします。
    return votes.length;
}
/** 1タイムテーブル案のスコアを返します。(そのタイムテーブル案が抱えるすべてのコマの各スコアの合計です) */
function calcScore(plan) {
    plan.score = plan.frames
        .map(calcScoreOfFrame)
        .reduce(function (n, m) { return n + m; }, 0);
}
var app;
(function (app) {
    function doChoseTheme(themes) {
        // 全投稿テーマをもとに、総当たりでコマ(frame)のすべての組み合わせを生成します。
        var frames = makeFrames(themes);
        // さらにそのコマの集合をもとに、4コマの組み合わせ = タイムテーブル案を、総当たりで生成します。
        // そのうち、同じテーマが重複して現れていたり、同じスピーカーが同一時間に重複していたりする不整合をfilterで除外します。
        var plans = makePlans(frames)
            .filter(notDupulicated);
        // そうして求めたタイムテーブル案に、投票し且つ参加できる人数によるスコアを求めて score プロパティに設定します。
        plans.forEach(function (plan) { return calcScore(plan); });
        // スコアの大きい順に並べ替えて、戻り値として返します。
        return plans.sort(function (a, b) { return b.score - a.score; });
    }
    var MainController = (function () {
        function MainController($scope) {
            var _this = this;
            $.get('http://www.codejapan.jp/2015/api/1.0/offer/')
                .done(function (data) {
                var themes = data.map(function (theme) {
                    return {
                        title: theme.title,
                        speaker: theme.speaker.nickname,
                        votes: theme.voters.map(function (vorter) { return vorter.nickname; })
                    };
                });
                themes = themes
                    .filter(function (t) { return t.title != 'CodeJP ならびに Code in 定山渓温泉について'; })
                    .filter(function (t) { return t.title != '脆弱性を探せ！'; });
                _this.plans = doChoseTheme(themes);
                _this.sortedThemes = themes.sort(function (a, b) { return b.votes.length - a.votes.length; });
                $scope.$apply();
            });
        }
        return MainController;
    })();
    app.MainController = MainController;
    angular
        .module('app', [])
        .controller('mainController', MainController);
})(app || (app = {}));
//# sourceMappingURL=app.js.map