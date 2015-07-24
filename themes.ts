interface ITheme {
    name: string;
    speaker: string;
    votes: string[];
}

var themes: ITheme[] = [
    {
        name: 'jQuery入門編',
        speaker: 'sasuke',
        votes: ['chack411', 'miso_soup3']
    },
    {
        name: 'Raspberry Pi を使って、Web 技術を UI にして、スマホからLEDやモーターなどを操作してみる',
        speaker: 'jsakamoto',
        votes: [
            'Aut_Spyke',
            'sasuke',
            'chack411',
            'miso_soup3',
            'tututen']
    },
    {
        name: 'Beyond Openness of the "Death Star"',
        speaker: 'chack411',
        votes: [
            'Aut_Spyke',
            'sasuke',
            'DarkCrash3',
            'jsakamoto',
            'miso_soup3']
    },
    {
        name: 'ASP.NET MVCやAngularJSでオレオレ雑談会',
        speaker: 'KatsuYuzu',
        votes: [
            'sasuke',
            'chack411',
            'jsakamoto',
            'miso_soup3',
            'rakuda_daraku'
        ]
    },
    {
        name: 'しーぴーゆーの話',
        speaker: 'Niiyama',
        votes: [
            'chack411',
            'DarkCrash3',
            'rakuda_daraku',
            'tututen',
            'KatsuYuzu'
        ]
    },
    {
        name: 'C#単体テストゆるふわ体験会',
        speaker: 'miso_soup3',
        votes: [
            'Aut_Spyke',
            'sasuke',
            'chack411',
            'DarkCrash3',
            'tututen',
            'KatsuYuzu'
        ]
    },
    {
        name: 'Visual Studio 2015 新機能 つまみ食い',
        speaker: 'miso_soup3',
        votes: [
            'sasuke',
            'chack411',
            'rakuda_daraku',
            'tututen',
            'KatsuYuzu'
        ]
    },
    {
        name: 'JavaScript の単体テストフレームワーク「jasmine」を使った単体テストの実行環境構築と実践',
        speaker: 'jsakamoto',
        votes: ['rakuda_daraku']
    },
    {
        name: 'Cordova・Electronを利用して1ソースでマルチプラットフォームアプリを作ってみよう',
        speaker: 'rakuda_daraku',
        votes: [
            'jsakamoto',
            'tututen',
            'れいさ'
        ]
    },
    {
        name: 'Node.js × TypeScript × MongoDB × Swagger で楽しい REST API 開発 (Hands-on)',
        speaker: 'れいさ',
        votes: [
            'rakuda_daraku',
            'tututen'
        ]
    },
    {
        name: '脆弱性を探せ！',
        speaker: 'れいさ',
        votes: [
            'DarkCrash3',
            'rakuda_daraku',
            'tututen'
        ]
    },
    {
        name: '黒い画面（CLI）での小枝',
        speaker: 'tututen',
        votes: ['Niiyama']
    },
    {
        name: 'MicroWebFramework「Flask」のご紹介',
        speaker: 'tututen',
        votes: ['jsakamoto']
    },
];