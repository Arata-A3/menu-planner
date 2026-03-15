// --- タブ切り替えロジック ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Tab styling
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Pane visibility
        tabPanes.forEach(pane => pane.classList.remove('active'));
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// --- レシピカード描画ユーティリティ ---
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    // 検索用URL (Google検索へのリンクを例として)
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(recipe.name + ' レシピ')}`;

    card.innerHTML = `
        <h3>${recipe.name}</h3>
        <div class="recipe-tags">
            <span class="badge">${recipe.genre}</span>
            <span class="badge">${recipe.type}</span>
            <span class="badge">調理: ${recipe.time}</span>
        </div>
        <p class="recipe-ingredients"><strong>材料:</strong> ${recipe.ingredients.join(', ')}</p>
        <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" class="search-recipe-btn">レシピを検索 🔍</a>
    `;
    return card;
}

function renderRecipes(recipesArray, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (recipesArray.length === 0) {
        container.innerHTML = '<p style="text-align:center; font-size:1.2rem;">当てはまる料理が見つかりませんでした😢</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'recipe-cards';

    recipesArray.forEach(recipe => {
        grid.appendChild(createRecipeCard(recipe));
    });

    container.appendChild(grid);
}

// --- 1. 材料で絞り込む機能 ---
const allIngredients = new Set();
recipes.forEach(r => r.ingredients.forEach(i => allIngredients.add(i)));
const ingredientList = Array.from(allIngredients);

// 材料をカテゴリ分けするロジック
const ingredientCategories = {
    '🍖 肉類': ['豚肉', '牛肉', '鶏肉', 'ひき肉', 'ラム肉', '馬肉', '牛もつ', '豚もつ', '牛すじ', 'チャーシュー', 'ベーコン', 'ウインナー', 'ソーセージ', 'ハム', '生ハム', 'チョリソー'],
    '🐟 魚介類': ['鮭', 'サーモン', 'サバ', 'アジ', 'マグロ', '白身魚', 'ぶり', '鯛', 'カツオ', 'カレイ', '金目鯛', '赤魚', 'サワラ', '銀だら', '舌平目', 'ホッケ', 'にしん', 'さんま', 'あゆ', 'うなぎ', 'ししゃも', 'イワシ', 'えんがわ', 'ふぐ', 'あんこう', 'タラ', 'エビ', 'イカ', 'タコ', '干ししいたけ', 'アサリ', 'はまぐり', 'しじみ', 'カキ', 'ホタテ', 'カニ', 'しらす', '明太子', 'たらこ', 'ツナ', 'ちくわ', 'クラゲ', 'サメ軟骨', 'タラの胃袋'],
    '🥕 野菜・きのこ': ['キャベツ', 'レタス', 'サニーレタス', 'ベビーリーフ', 'トマト', 'ピーマン', 'パプリカ', 'ナス', '大根', 'にんじん', '玉ねぎ', 'じゃがいも', 'さつまいも', 'かぼちゃ', 'ほうれん草', '小松菜', 'もやし', 'アスパラ', 'ごぼう', 'れんこん', 'たけのこ', 'ニラ', 'ねぎ', '生姜', 'にんにく', 'セロリ', 'きゅうり', '水菜', 'まいたけ', 'せり', '大葉', 'グリーンピース', 'コーン', '枝豆', 'そら豆', 'オリーブ', 'きのこ類', 'しいたけ', 'えのき', 'なめこ', 'マッシュルーム'],
    '🥚 卵・大豆・乳製品': ['卵', '豆腐', '厚揚げ', '油揚げ', 'おから', '豆乳', '大豆', '納豆', 'チーズ', 'モッツァレラチーズ', 'ゴルゴンゾーラチーズ', 'パルメザンチーズ', 'カマンベール', 'ブルーチーズ', 'チェダーチーズ', 'クリームチーズ', 'バター', '牛乳', '生クリーム', 'ヨーグルト'],
    '🍚 主食・粉': ['ご飯', '米', '餅', '小麦粉', 'ホットケーキミックス', 'パン粉', '食パン', 'フランスパン', 'コッペパン', 'バンズ', 'うどん', 'そば', '茶そば', '中華麺', 'ちゃんぽん麺', 'パスタ', 'マカロニ', '米麺', 'ビーフン', '春雨', '餃子の皮', 'シュウマイの皮', '春巻きの皮', 'ライスペーパー', 'そば粉'],
    '🍶 その他': ['キムチ', '白菜キムチ', '大根キムチ', 'きゅうりキムチ', 'ザーサイ', 'メンマ', 'ピータン', 'こんにゃく', 'しらたき', 'わかめ', '昆布', 'ひじき', '海苔', 'もずく', '梅干し', '塩昆布', '天かす', 'ごま', '黒ごま', '松の実', 'ナッツ', '栗', 'クルトン', 'いちご', 'バナナ', 'キウイ', 'メロン', 'イチジク', '出汁', '醤油', '味噌', '白味噌', 'もろみ味噌', '塩', '胡椒', '砂糖', '酢', 'ポン酢', 'マヨネーズ', 'ケチャップ', 'ソース', 'ホワイトソース', 'トマトソース', 'デミグラスソース', 'タルタルソース', 'オリーブオイル', 'ごま油', 'バター', '酒', 'みりん', 'ラー油', '豆板醤', 'コチュジャン', 'コンソメ', '中華スープ', 'カレールー', 'ごまだれ', 'ドレッシング']
};

const ingredientContainer = document.getElementById('ingredient-list');
const selectedIngredients = new Set();
ingredientContainer.innerHTML = ''; // クリア

// まだ分類されていないものを「その他」に入れるためのセット
let categorized = new Set();

Object.keys(ingredientCategories).forEach(catName => {
    // このカテゴリに属する全アイテム
    const itemsInCat = ingredientList.filter(ing => ingredientCategories[catName].includes(ing));

    // itemsInCat.forEach(i => categorized.add(i)); // 下のループで処理する

    if (itemsInCat.length > 0 || catName === '🍶 その他') {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'ingredient-group';

        const groupTitle = document.createElement('h3');
        groupTitle.className = 'ingredient-group-title';
        groupTitle.innerText = catName;

        // 折りたたみトグル
        groupTitle.addEventListener('click', () => {
            groupTagsDiv.classList.toggle('collapsed');
            groupTitle.classList.toggle('collapsed');
        });

        const groupTagsDiv = document.createElement('div');
        groupTagsDiv.className = 'ingredient-group-tags';

        itemsInCat.forEach(ing => {
            categorized.add(ing);
            const tag = document.createElement('span');
            tag.className = 'ingredient-tag';
            tag.textContent = ing;
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
                if (tag.classList.contains('selected')) {
                    selectedIngredients.add(ing);
                } else {
                    selectedIngredients.delete(ing);
                }
            });
            groupTagsDiv.appendChild(tag);
        });

        // 特別に「その他」カテゴリの場合は、未分類のものも追加する
        if (catName === '🍶 その他') {
            ingredientList.forEach(ing => {
                if (!categorized.has(ing)) {
                    const tag = document.createElement('span');
                    tag.className = 'ingredient-tag';
                    tag.textContent = ing;
                    tag.addEventListener('click', () => {
                        tag.classList.toggle('selected');
                        if (tag.classList.contains('selected')) {
                            selectedIngredients.add(ing);
                        } else {
                            selectedIngredients.delete(ing);
                        }
                    });
                    groupTagsDiv.appendChild(tag);
                }
            });
        }

        groupDiv.appendChild(groupTitle);
        groupDiv.appendChild(groupTagsDiv);
        ingredientContainer.appendChild(groupDiv);
    }
});

// (置換済)

// 検索ボタンのアクション
document.getElementById('search-by-ingredient').addEventListener('click', () => {
    if (selectedIngredients.size === 0) {
        renderRecipes(recipes, 'ingredient-result'); // 何も選んでなければ全件表示
        return;
    }

    const filtered = recipes.filter(recipe => {
        // 選択された材料を「すべて」あるいは「1つでも」含むかでロジックが変わるが、
        // 冷蔵庫にあるもので作れるもの＝「レシピの材料が、選択された材料に含まれている割合が高い」などを考慮すると複雑。
        // ここではシンプルに「選択した材料を1つでも含むレシピ」を抽出する（OR検索）
        return recipe.ingredients.some(ing => selectedIngredients.has(ing));
    });

    // 関連度が高い（一致する材料が多い）順にソートするとより親切
    filtered.sort((a, b) => {
        const aMatch = a.ingredients.filter(i => selectedIngredients.has(i)).length;
        const bMatch = b.ingredients.filter(i => selectedIngredients.has(i)).length;
        return bMatch - aMatch;
    });

    renderRecipes(filtered, 'ingredient-result');
});

// --- 2. ランダム機能 ---
const startRandomBtn = document.getElementById('start-random');
const randomDisplay = document.getElementById('random-display');
const randomResult = document.getElementById('random-result');
let isSpinning = false;

startRandomBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    startRandomBtn.disabled = true;
    startRandomBtn.classList.remove('pulse');
    randomResult.innerHTML = ''; // クリア

    let counter = 0;
    const maxSpins = 20; // ルーレットの回数
    const intervalTime = 50;

    const spinInterval = setInterval(() => {
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        randomDisplay.textContent = randomRecipe.name;
        counter++;

        if (counter > maxSpins) {
            clearInterval(spinInterval);
            const finalRecipe = recipes[Math.floor(Math.random() * recipes.length)];
            randomDisplay.textContent = finalRecipe.name; // 最終結果

            // 下部に詳細カードを表示
            const card = createRecipeCard(finalRecipe);
            card.style.margin = '0 auto';
            card.style.maxWidth = '300px';
            randomResult.appendChild(card);

            isSpinning = false;
            startRandomBtn.disabled = false;
            startRandomBtn.textContent = 'もう一度回す！';
        }
    }, intervalTime);
});

// --- 3. 質問で絞り込む機能 ---
const questions = [
    {
        text: "今日の気分（お腹の空き具合）は？",
        key: "type",
        options: [
            { label: "がっつり食べたい！🥩", value: "がっつり" },
            { label: "ふつう！🥢", value: "普通" },
            { label: "あっさりでいいかな🥗", value: "あっさり" }
        ]
    },
    {
        text: "どのジャンルが食べたい？",
        key: "genre",
        options: [
            { label: "和食 🍚", value: "和食" },
            { label: "洋食 🍝", value: "洋食" },
            { label: "中華 🥟", value: "中華" },
            { label: "韓国 🌶️", value: "韓国" },
            { label: "なんでもいい！", value: null } // 絞り込まない
        ]
    },
    {
        text: "調理時間はどうする？",
        key: "time",
        options: [
            { label: "パパッと短めで！⏱️", value: "短め" },
            { label: "じっくり長くてもOK🍳", value: null } // 長め＆普通も許容
        ]
    }
];

let currentQuestionIndex = 0;
let userFilters = {};

const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const questionResult = document.getElementById('question-result');
const resetQuestionBtn = document.getElementById('reset-question');
const questionContainer = document.getElementById('question-container');

function showQuestion() {
    answerButtons.innerHTML = '';

    if (currentQuestionIndex >= questions.length) {
        // 質問終了、結果表示
        showQuestionResult();
        return;
    }

    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.text;

    currentQ.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
            if (opt.value !== null) {
                userFilters[currentQ.key] = opt.value;
            }
            currentQuestionIndex++;
            showQuestion();
        });
        answerButtons.appendChild(btn);
    });
}

function showQuestionResult() {
    questionContainer.classList.add('hidden');
    questionResult.classList.remove('hidden');
    resetQuestionBtn.classList.remove('hidden');

    let filtered = recipes.filter(r => {
        let isMatch = true;
        if (userFilters.type && r.type !== userFilters.type) isMatch = false;
        if (userFilters.genre && r.genre !== userFilters.genre) isMatch = false;
        if (userFilters.time && r.time !== userFilters.time) {
            // "短め"を希望したのに短めじゃない場合は除外。null(長くてもOK)なら除外しない。
            isMatch = false;
        }
        return isMatch;
    });

    renderRecipes(filtered, 'question-result');
}

resetQuestionBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    userFilters = {};
    questionContainer.classList.remove('hidden');
    questionResult.classList.add('hidden');
    resetQuestionBtn.classList.add('hidden');
    questionResult.innerHTML = '';
    showQuestion();
});

// 初期化
showQuestion();

