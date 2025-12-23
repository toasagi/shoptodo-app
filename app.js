// 多言語対応
const i18n = {
    ja: {
        title: 'ShopTodo - E2Eテスト練習用アプリ',
        login: 'ログイン',
        logout: 'ログアウト',
        username: 'ユーザー名:',
        password: 'パスワード:',
        demo_info: 'デモ用: ユーザー名「demo」、パスワード「Demo@2025!」でログインできます',
        product_catalog: '商品カタログ',
        search_placeholder: '商品を検索...',
        all_categories: 'すべてのカテゴリ',
        electronics: '電子機器',
        clothing: '衣類',
        books: '書籍',
        home: 'ホーム',
        sort_name: '名前順',
        sort_price_low: '価格（安い順）',
        sort_price_high: '価格（高い順）',
        shopping_cart: 'ショッピングカート',
        cart_empty: 'カートは空です',
        checkout: 'チェックアウト',
        favorite_memo: 'お気に入り商品メモ',
        memo_placeholder: 'メモを追加...',
        add: '追加',
        footer_text: '© 2025 ShopTodo - E2Eテスト練習用アプリケーション',
        skip_to_content: 'メインコンテンツへスキップ',
        add_to_cart: 'カートに追加',
        product_image: '商品画像',
        total: '合計',
        memo_empty: 'メモはありません',
        login_required: 'ログインしてください',
        product_added: '商品をカートに追加しました',
        product_removed: '商品をカートから削除しました',
        memo_added: 'メモを追加しました',
        memo_deleted: 'メモを削除しました',
        login_success: 'ログインしました',
        logout_success: 'ログアウトしました',
        login_error: 'ユーザー名またはパスワードが正しくありません',
        checkout_confirm: 'でチェックアウトしますか？',
        checkout_success: 'チェックアウトが完了しました',
        complete: '完了にする',
        incomplete: '未完了にする',
        delete: '削除',
        // Checkout
        checkout_title: 'チェックアウト',
        shipping_info: '配送先情報',
        payment_method: '支払い方法',
        order_confirm: '注文確認',
        full_name: 'お名前',
        email: 'メールアドレス',
        phone: '電話番号',
        postal_code: '郵便番号',
        address: '住所',
        credit_card: 'クレジットカード',
        bank_transfer: '銀行振込',
        cash_on_delivery: '代金引換',
        next: '次へ',
        back: '戻る',
        place_order: '注文を確定',
        order_complete: '注文が完了しました！',
        order_number: '注文番号',
        order_history: '注文履歴',
        view_order_history: '注文履歴を見る',
        no_orders: '注文履歴はありません',
        order_date: '注文日',
        order_items: '注文商品',
        order_total: '合計金額',
        order_details: '注文詳細',
        shipping_to: '配送先',
        payment: '支払い',
        item_count: '点',
        required_field: 'この項目は必須です',
        invalid_email: '有効なメールアドレスを入力してください',
        invalid_phone: '有効な電話番号を入力してください',
        // User Profile
        user_profile: 'ユーザー情報',
        display_name: '名前',
        phone_number: '電話番号',
        preferred_payment: 'お支払い方法',
        save: '保存',
        saved: '保存しました',
        back_to_shop: 'ショップに戻る',
        purchase_history: '購入履歴',
        no_profile: 'プロファイル情報がありません',
        profile_saved: 'プロファイルを保存しました',
        // Registration
        register: '新規登録',
        confirm_password: 'パスワード確認:',
        no_account: 'アカウントをお持ちでないですか？',
        register_link: '新規登録',
        have_account: 'アカウントをお持ちですか？',
        login_link: 'ログイン',
        registration_success: '登録が完了しました',
        username_taken: 'このユーザー名は既に使用されています',
        email_taken: 'このメールアドレスは既に登録されています',
        password_mismatch: 'パスワードが一致しません',
        password_too_short: 'パスワードは10文字以上必要です',
        password_complexity: 'パスワードには英字、数字、記号を含める必要があります',
        username_too_short: 'ユーザー名は3文字以上必要です',
        demo_mode_login: 'デモモードでログインしました（バックエンド未接続）',
        backend_required: 'このユーザーでログインするにはバックエンドサーバーが必要です',
        // Recommended & Category Tabs
        recommended_products: 'おすすめ商品',
        all_products: 'すべての商品',
        // Navigation
        nav_home: 'ホーム',
        nav_products: '商品一覧',
        nav_cart: 'カート',
        nav_order_history: '注文履歴',
        nav_todo: 'Todo',
        nav_profile: 'プロフィール',
        product_names: {
            'スマートフォン': 'Smartphone',
            'ノートパソコン': 'Laptop',
            'Tシャツ': 'T-shirt',
            'ジーンズ': 'Jeans',
            'プログラミング入門書': 'Programming Basics',
            'JavaScript完全ガイド': 'JavaScript Complete Guide',
            'コーヒーメーカー': 'Coffee Maker',
            '掃除機': 'Vacuum Cleaner',
            'ワイヤレスイヤホン': 'Wireless Earphones',
            'スニーカー': 'Sneakers',
            'Web開発の教科書': 'Web Development Textbook',
            'キッチン用品セット': 'Kitchen Set',
            // Electronics - new
            'タブレット': 'Tablet',
            'デジタルカメラ': 'Digital Camera',
            'スマートウォッチ': 'Smart Watch',
            'ポータブルスピーカー': 'Portable Speaker',
            'ゲーム機': 'Game Console',
            '電子書籍リーダー': 'E-Reader',
            'ドローン': 'Drone',
            'モニター': 'Monitor',
            'キーボード': 'Keyboard',
            'マウス': 'Mouse',
            // Clothing - new
            'ワンピース': 'Dress',
            'ジャケット': 'Jacket',
            'セーター': 'Sweater',
            '帽子': 'Hat',
            'スカーフ': 'Scarf',
            '手袋': 'Gloves',
            '靴下セット': 'Socks Set',
            'ベルト': 'Belt',
            'サンダル': 'Sandals',
            'ブーツ': 'Boots',
            // Books - new
            'Python入門': 'Python Basics',
            'データベース設計': 'Database Design',
            'UI/UXデザイン入門': 'UI/UX Design Intro',
            'クラウド入門': 'Cloud Computing Intro',
            'セキュリティ実践ガイド': 'Security Practice Guide',
            'AI・機械学習入門': 'AI & ML Introduction',
            'ネットワーク基礎': 'Network Fundamentals',
            'アジャイル開発入門': 'Agile Development Intro',
            'テスト駆動開発': 'Test-Driven Development',
            'DevOps実践ガイド': 'DevOps Practice Guide',
            // Home - new
            '電子レンジ': 'Microwave',
            'トースター': 'Toaster',
            '炊飯器': 'Rice Cooker',
            '加湿器': 'Humidifier',
            '空気清浄機': 'Air Purifier',
            '照明スタンド': 'Desk Lamp',
            '時計': 'Clock',
            '収納ボックス': 'Storage Box',
            'クッション': 'Cushion',
            '植木鉢セット': 'Plant Pot Set'
        }
    },
    en: {
        title: 'ShopTodo - E2E Test Practice App',
        login: 'Login',
        logout: 'Logout',
        username: 'Username:',
        password: 'Password:',
        demo_info: 'Demo: Use username "demo" and password "Demo@2025!" to login',
        product_catalog: 'Product Catalog',
        search_placeholder: 'Search products...',
        all_categories: 'All Categories',
        electronics: 'Electronics',
        clothing: 'Clothing',
        books: 'Books',
        home: 'Home',
        sort_name: 'Name',
        sort_price_low: 'Price (Low to High)',
        sort_price_high: 'Price (High to Low)',
        shopping_cart: 'Shopping Cart',
        cart_empty: 'Cart is empty',
        checkout: 'Checkout',
        favorite_memo: 'Favorite Product Memo',
        memo_placeholder: 'Add memo...',
        add: 'Add',
        footer_text: '© 2025 ShopTodo - E2E Test Practice Application',
        skip_to_content: 'Skip to main content',
        add_to_cart: 'Add to Cart',
        product_image: 'Product Image',
        total: 'Total',
        memo_empty: 'No memos',
        login_required: 'Please login',
        product_added: 'Product added to cart',
        product_removed: 'Product removed from cart',
        memo_added: 'Memo added',
        memo_deleted: 'Memo deleted',
        login_success: 'Logged in successfully',
        logout_success: 'Logged out successfully',
        login_error: 'Invalid username or password',
        checkout_confirm: 'Proceed with checkout for',
        checkout_success: 'Checkout completed successfully',
        complete: 'Mark as complete',
        incomplete: 'Mark as incomplete',
        delete: 'Delete',
        // Checkout
        checkout_title: 'Checkout',
        shipping_info: 'Shipping Information',
        payment_method: 'Payment Method',
        order_confirm: 'Order Confirmation',
        full_name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        postal_code: 'Postal Code',
        address: 'Address',
        credit_card: 'Credit Card',
        bank_transfer: 'Bank Transfer',
        cash_on_delivery: 'Cash on Delivery',
        next: 'Next',
        back: 'Back',
        place_order: 'Place Order',
        order_complete: 'Order Completed Successfully!',
        order_number: 'Order Number',
        order_history: 'Order History',
        view_order_history: 'View Order History',
        no_orders: 'No orders yet',
        order_date: 'Order Date',
        order_items: 'Items',
        order_total: 'Total',
        order_details: 'Order Details',
        shipping_to: 'Shipping to',
        payment: 'Payment',
        item_count: 'items',
        required_field: 'This field is required',
        invalid_email: 'Please enter a valid email address',
        invalid_phone: 'Please enter a valid phone number',
        // User Profile
        user_profile: 'User Profile',
        display_name: 'Name',
        phone_number: 'Phone Number',
        preferred_payment: 'Payment Method',
        save: 'Save',
        saved: 'Saved',
        back_to_shop: 'Back to Shop',
        purchase_history: 'Purchase History',
        no_profile: 'No profile information',
        profile_saved: 'Profile saved',
        // Registration
        register: 'Register',
        confirm_password: 'Confirm Password:',
        no_account: "Don't have an account?",
        register_link: 'Register',
        have_account: 'Already have an account?',
        login_link: 'Login',
        registration_success: 'Registration successful',
        username_taken: 'Username is already taken',
        email_taken: 'Email is already registered',
        password_mismatch: 'Passwords do not match',
        password_too_short: 'Password must be at least 10 characters',
        password_complexity: 'Password must contain letters, numbers, and symbols',
        username_too_short: 'Username must be at least 3 characters',
        demo_mode_login: 'Logged in with demo mode (backend not connected)',
        backend_required: 'Backend server is required to login with this user',
        // Recommended & Category Tabs
        recommended_products: 'Recommended',
        all_products: 'All Products',
        // Navigation
        nav_home: 'Home',
        nav_products: 'Products',
        nav_cart: 'Cart',
        nav_order_history: 'Orders',
        nav_todo: 'Todo',
        nav_profile: 'Profile',
        product_names: {
            'スマートフォン': 'Smartphone',
            'ノートパソコン': 'Laptop',
            'Tシャツ': 'T-shirt',
            'ジーンズ': 'Jeans',
            'プログラミング入門書': 'Programming Basics',
            'JavaScript完全ガイド': 'JavaScript Complete Guide',
            'コーヒーメーカー': 'Coffee Maker',
            '掃除機': 'Vacuum Cleaner',
            'ワイヤレスイヤホン': 'Wireless Earphones',
            'スニーカー': 'Sneakers',
            'Web開発の教科書': 'Web Development Textbook',
            'キッチン用品セット': 'Kitchen Set',
            // Electronics - new
            'タブレット': 'Tablet',
            'デジタルカメラ': 'Digital Camera',
            'スマートウォッチ': 'Smart Watch',
            'ポータブルスピーカー': 'Portable Speaker',
            'ゲーム機': 'Game Console',
            '電子書籍リーダー': 'E-Reader',
            'ドローン': 'Drone',
            'モニター': 'Monitor',
            'キーボード': 'Keyboard',
            'マウス': 'Mouse',
            // Clothing - new
            'ワンピース': 'Dress',
            'ジャケット': 'Jacket',
            'セーター': 'Sweater',
            '帽子': 'Hat',
            'スカーフ': 'Scarf',
            '手袋': 'Gloves',
            '靴下セット': 'Socks Set',
            'ベルト': 'Belt',
            'サンダル': 'Sandals',
            'ブーツ': 'Boots',
            // Books - new
            'Python入門': 'Python Basics',
            'データベース設計': 'Database Design',
            'UI/UXデザイン入門': 'UI/UX Design Intro',
            'クラウド入門': 'Cloud Computing Intro',
            'セキュリティ実践ガイド': 'Security Practice Guide',
            'AI・機械学習入門': 'AI & ML Introduction',
            'ネットワーク基礎': 'Network Fundamentals',
            'アジャイル開発入門': 'Agile Development Intro',
            'テスト駆動開発': 'Test-Driven Development',
            'DevOps実践ガイド': 'DevOps Practice Guide',
            // Home - new
            '電子レンジ': 'Microwave',
            'トースター': 'Toaster',
            '炊飯器': 'Rice Cooker',
            '加湿器': 'Humidifier',
            '空気清浄機': 'Air Purifier',
            '照明スタンド': 'Desk Lamp',
            '時計': 'Clock',
            '収納ボックス': 'Storage Box',
            'クッション': 'Cushion',
            '植木鉢セット': 'Plant Pot Set'
        }
    }
};

// XSS対策: HTMLエスケープ関数
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// SVGプレースホルダー画像生成関数（個別商品対応）
function generateProductImage(emoji, primaryColor, secondaryColor) {
    // グラデーション背景を持つSVG画像を生成
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <defs>
                <linearGradient id="gradient-${emoji}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
                </filter>
            </defs>
            <rect width="400" height="300" fill="url(#gradient-${emoji})"/>
            <circle cx="200" cy="150" r="70" fill="rgba(255,255,255,0.2)" filter="url(#shadow)"/>
            <text x="200" y="150" font-size="90" text-anchor="middle" dominant-baseline="middle" filter="url(#shadow)">
                ${emoji}
            </text>
        </svg>
    `;

    // Data URL形式に変換
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}

// 後方互換性のため、カテゴリベースの画像生成も残す
function generatePlaceholderImage(category) {
    const categoryConfig = {
        electronics: { emoji: '📱', primary: '#007bff', secondary: '#0056b3' },
        clothing: { emoji: '👕', primary: '#28a745', secondary: '#1e7e34' },
        books: { emoji: '📚', primary: '#fd7e14', secondary: '#dc6502' },
        home: { emoji: '🏠', primary: '#6f42c1', secondary: '#5a32a3' }
    };

    const config = categoryConfig[category] || { emoji: '🏷️', primary: '#6c757d', secondary: '#5a6268' };
    return generateProductImage(config.emoji, config.primary, config.secondary);
}

// アプリケーションの状態管理
class AppState {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.cart = [];
        this.todos = [];
        this.orders = [];
        this.isBackendAuthenticated = false; // バックエンドAPI認証フラグ
        this.filteredProducts = [];
        this.currentLanguage = 'ja';
        this.currentCategory = ''; // カテゴリタブの状態（空=すべて）

        this.initializeData();
        this.loadFromStorage();
    }

    initializeData() {
        // サンプル商品データ（各商品に個別の絵文字と色を設定）
        this.products = [
            { id: 1, name: 'スマートフォン', price: 89800, category: 'electronics', image: generateProductImage('📱', '#007bff', '#0056b3') },
            { id: 2, name: 'ノートパソコン', price: 129800, category: 'electronics', image: generateProductImage('💻', '#17a2b8', '#117a8b') },
            { id: 3, name: 'Tシャツ', price: 2980, category: 'clothing', image: generateProductImage('👕', '#28a745', '#1e7e34') },
            { id: 4, name: 'ジーンズ', price: 7980, category: 'clothing', image: generateProductImage('👖', '#20c997', '#1aa179') },
            { id: 5, name: 'プログラミング入門書', price: 3200, category: 'books', image: generateProductImage('📖', '#fd7e14', '#dc6502') },
            { id: 6, name: 'JavaScript完全ガイド', price: 4800, category: 'books', image: generateProductImage('📘', '#f39c12', '#e67e22') },
            { id: 7, name: 'コーヒーメーカー', price: 15800, category: 'home', image: generateProductImage('☕', '#6f42c1', '#5a32a3') },
            { id: 8, name: '掃除機', price: 25800, category: 'home', image: generateProductImage('🧹', '#e83e8c', '#c72166') },
            { id: 9, name: 'ワイヤレスイヤホン', price: 12800, category: 'electronics', image: generateProductImage('🎧', '#6610f2', '#520dc2') },
            { id: 10, name: 'スニーカー', price: 8900, category: 'clothing', image: generateProductImage('👟', '#20c997', '#199d76') },
            { id: 11, name: 'Web開発の教科書', price: 3800, category: 'books', image: generateProductImage('📚', '#e67e22', '#d35400') },
            { id: 12, name: 'キッチン用品セット', price: 9800, category: 'home', image: generateProductImage('🍳', '#e74c3c', '#c0392b') },
            // Electronics - 10 new products
            { id: 13, name: 'タブレット', price: 49800, category: 'electronics', image: generateProductImage('📲', '#3498db', '#2980b9') },
            { id: 14, name: 'デジタルカメラ', price: 68000, category: 'electronics', image: generateProductImage('📷', '#9b59b6', '#8e44ad') },
            { id: 15, name: 'スマートウォッチ', price: 35800, category: 'electronics', image: generateProductImage('⌚', '#1abc9c', '#16a085') },
            { id: 16, name: 'ポータブルスピーカー', price: 9800, category: 'electronics', image: generateProductImage('🔊', '#e74c3c', '#c0392b') },
            { id: 17, name: 'ゲーム機', price: 49800, category: 'electronics', image: generateProductImage('🎮', '#2ecc71', '#27ae60') },
            { id: 18, name: '電子書籍リーダー', price: 15800, category: 'electronics', image: generateProductImage('📖', '#34495e', '#2c3e50') },
            { id: 19, name: 'ドローン', price: 78000, category: 'electronics', image: generateProductImage('🚁', '#f39c12', '#d68910') },
            { id: 20, name: 'モニター', price: 42800, category: 'electronics', image: generateProductImage('🖥️', '#7f8c8d', '#616a6b') },
            { id: 21, name: 'キーボード', price: 12800, category: 'electronics', image: generateProductImage('⌨️', '#95a5a6', '#7f8c8d') },
            { id: 22, name: 'マウス', price: 5800, category: 'electronics', image: generateProductImage('🖱️', '#bdc3c7', '#a6acaf') },
            // Clothing - 10 new products
            { id: 23, name: 'ワンピース', price: 8900, category: 'clothing', image: generateProductImage('👗', '#e91e63', '#c2185b') },
            { id: 24, name: 'ジャケット', price: 15800, category: 'clothing', image: generateProductImage('🧥', '#795548', '#5d4037') },
            { id: 25, name: 'セーター', price: 6800, category: 'clothing', image: generateProductImage('🧶', '#ff5722', '#e64a19') },
            { id: 26, name: '帽子', price: 3200, category: 'clothing', image: generateProductImage('🧢', '#2196f3', '#1976d2') },
            { id: 27, name: 'スカーフ', price: 4500, category: 'clothing', image: generateProductImage('🧣', '#9c27b0', '#7b1fa2') },
            { id: 28, name: '手袋', price: 2800, category: 'clothing', image: generateProductImage('🧤', '#607d8b', '#455a64') },
            { id: 29, name: '靴下セット', price: 1980, category: 'clothing', image: generateProductImage('🧦', '#00bcd4', '#0097a7') },
            { id: 30, name: 'ベルト', price: 4800, category: 'clothing', image: generateProductImage('👔', '#3f51b5', '#303f9f') },
            { id: 31, name: 'サンダル', price: 5500, category: 'clothing', image: generateProductImage('👡', '#ffeb3b', '#fbc02d') },
            { id: 32, name: 'ブーツ', price: 18800, category: 'clothing', image: generateProductImage('👢', '#4e342e', '#3e2723') },
            // Books - 10 new products
            { id: 33, name: 'Python入門', price: 3200, category: 'books', image: generateProductImage('🐍', '#306998', '#ffd43b') },
            { id: 34, name: 'データベース設計', price: 4200, category: 'books', image: generateProductImage('🗄️', '#00695c', '#004d40') },
            { id: 35, name: 'UI/UXデザイン入門', price: 3800, category: 'books', image: generateProductImage('🎨', '#ff4081', '#f50057') },
            { id: 36, name: 'クラウド入門', price: 4500, category: 'books', image: generateProductImage('☁️', '#03a9f4', '#0288d1') },
            { id: 37, name: 'セキュリティ実践ガイド', price: 5200, category: 'books', image: generateProductImage('🔒', '#f44336', '#d32f2f') },
            { id: 38, name: 'AI・機械学習入門', price: 4800, category: 'books', image: generateProductImage('🤖', '#673ab7', '#512da8') },
            { id: 39, name: 'ネットワーク基礎', price: 3600, category: 'books', image: generateProductImage('🌐', '#009688', '#00796b') },
            { id: 40, name: 'アジャイル開発入門', price: 3400, category: 'books', image: generateProductImage('🔄', '#4caf50', '#388e3c') },
            { id: 41, name: 'テスト駆動開発', price: 4000, category: 'books', image: generateProductImage('✅', '#8bc34a', '#689f38') },
            { id: 42, name: 'DevOps実践ガイド', price: 4600, category: 'books', image: generateProductImage('🔧', '#ff9800', '#f57c00') },
            // Home - 10 new products
            { id: 43, name: '電子レンジ', price: 18800, category: 'home', image: generateProductImage('📻', '#455a64', '#37474f') },
            { id: 44, name: 'トースター', price: 6800, category: 'home', image: generateProductImage('🍞', '#8d6e63', '#6d4c41') },
            { id: 45, name: '炊飯器', price: 25800, category: 'home', image: generateProductImage('🍚', '#fafafa', '#9e9e9e') },
            { id: 46, name: '加湿器', price: 8900, category: 'home', image: generateProductImage('💨', '#81d4fa', '#4fc3f7') },
            { id: 47, name: '空気清浄機', price: 35800, category: 'home', image: generateProductImage('🌬️', '#b3e5fc', '#81d4fa') },
            { id: 48, name: '照明スタンド', price: 7800, category: 'home', image: generateProductImage('💡', '#fff176', '#ffee58') },
            { id: 49, name: '時計', price: 4500, category: 'home', image: generateProductImage('⏰', '#ffab91', '#ff8a65') },
            { id: 50, name: '収納ボックス', price: 2980, category: 'home', image: generateProductImage('📦', '#bcaaa4', '#a1887f') },
            { id: 51, name: 'クッション', price: 3200, category: 'home', image: generateProductImage('🛋️', '#ce93d8', '#ba68c8') },
            { id: 52, name: '植木鉢セット', price: 4800, category: 'home', image: generateProductImage('🪴', '#a5d6a7', '#81c784') }
        ];

        this.filteredProducts = [...this.products];
    }

    loadFromStorage() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }

        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
        }

        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            this.orders = JSON.parse(savedOrders);
        }

        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
        }
    }

    saveToStorage() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('orders', JSON.stringify(this.orders));
        localStorage.setItem('language', this.currentLanguage);
    }

    setLanguage(language) {
        this.currentLanguage = language;
        this.saveToStorage();
    }

    login(username, password) {
        if (username === 'demo' && password === 'Demo@2025!') {
            // Load existing profile if available
            const savedProfile = localStorage.getItem('userProfile');
            const profile = savedProfile ? JSON.parse(savedProfile) : {
                displayName: '',
                phone: '',
                paymentMethod: ''
            };
            this.currentUser = { username, profile };
            this.saveToStorage();
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        this.cart = [];
        this.todos = [];
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        localStorage.removeItem('todos');
        // Keep profile and orders for next login
    }

    saveProfile(profileData) {
        if (!this.currentUser) return false;
        this.currentUser.profile = { ...profileData };
        localStorage.setItem('userProfile', JSON.stringify(this.currentUser.profile));
        this.saveToStorage();
        return true;
    }

    getProfile() {
        if (!this.currentUser) return null;
        return this.currentUser.profile || {
            displayName: '',
            phone: '',
            paymentMethod: ''
        };
    }

    createOrder(shippingInfo, paymentMethod) {
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: [...this.cart],
            total: this.getCartTotal(),
            shippingInfo: {...shippingInfo},
            paymentMethod: paymentMethod,
            status: 'completed'
        };

        this.orders.push(order);
        this.cart = [];
        this.saveToStorage();
        return order;
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveToStorage();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveToStorage();
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.saveToStorage();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    addTodo(text) {
        if (!text.trim()) return;

        const todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.saveToStorage();
    }

    toggleTodo(todoId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
        }
    }

    deleteTodo(todoId) {
        this.todos = this.todos.filter(t => t.id !== todoId);
        this.saveToStorage();
    }

    filterProducts(searchTerm, category, sortBy) {
        let filtered = [...this.products];

        // 検索フィルタ（日本語名と英語名の両方を検索）
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(product => {
                const japaneseName = product.name.toLowerCase();
                const englishName = (i18n.ja.product_names[product.name] || '').toLowerCase();
                return japaneseName.includes(searchLower) || englishName.includes(searchLower);
            });
        }

        // カテゴリフィルタ
        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }

        // ソート
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
            default:
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        this.filteredProducts = filtered;
    }

    // 各カテゴリから1商品ずつ選択しておすすめ商品を取得
    getRecommendedProducts() {
        const categories = ['electronics', 'clothing', 'books', 'home'];
        const recommended = [];

        categories.forEach(category => {
            const productsInCategory = this.products.filter(p => p.category === category);
            if (productsInCategory.length > 0) {
                // 各カテゴリから最初の商品を選択
                recommended.push(productsInCategory[0]);
            }
        });

        return recommended;
    }

    // 現在のカテゴリを設定
    setCategory(category) {
        this.currentCategory = category;
    }
}

// UI管理クラス
class UIManager {
    constructor(appState) {
        this.appState = appState;
        this.currentCheckoutStep = 1;
        this.shippingFormData = {};
        this.paymentMethodData = null;
        this.previousActiveElement = null;
        this.currentModal = null;
        this.boundHandleModalKeydown = this.handleModalKeydown.bind(this);
        this.initializeEventListeners();
        this.initializeCheckoutModal();
        this.updateUI();
    }

    // アクセシビリティ: モーダルのフォーカストラップ (WCAG 2.4.3)
    getFocusableElements(modal) {
        const focusableSelectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');
        return modal.querySelectorAll(focusableSelectors);
    }

    handleModalKeydown(e) {
        if (!this.currentModal) return;

        // Escapeキーでモーダルを閉じる
        if (e.key === 'Escape') {
            e.preventDefault();
            this.closeCurrentModal();
            return;
        }

        // Tabキーのトラップ
        if (e.key === 'Tab') {
            const focusableElements = this.getFocusableElements(this.currentModal);
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                // Shift+Tab: 最初の要素から最後の要素へ
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: 最後の要素から最初の要素へ
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    openModal(modal) {
        this.previousActiveElement = document.activeElement;
        this.currentModal = modal;
        modal.style.display = 'block';

        // フォーカスを最初のフォーカス可能要素に移動
        const focusableElements = this.getFocusableElements(modal);
        if (focusableElements.length > 0) {
            setTimeout(() => focusableElements[0].focus(), 50);
        }

        // キーボードイベントリスナーを追加
        document.addEventListener('keydown', this.boundHandleModalKeydown);
    }

    closeModal(modal) {
        modal.style.display = 'none';
        this.currentModal = null;

        // キーボードイベントリスナーを削除
        document.removeEventListener('keydown', this.boundHandleModalKeydown);

        // フォーカスを元の要素に戻す
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
            this.previousActiveElement = null;
        }
    }

    closeCurrentModal() {
        if (this.currentModal) {
            const modalId = this.currentModal.id;
            if (modalId === 'login-modal') {
                this.hideLoginModal();
            } else if (modalId === 'register-modal') {
                this.hideRegisterModal();
            } else if (modalId === 'checkout-modal') {
                this.hideCheckoutModal();
            } else if (modalId === 'order-history-modal') {
                this.hideOrderHistoryModal();
            }
        }
    }

    initializeEventListeners() {
        // 言語切り替え
        document.getElementById('lang-en').addEventListener('click', () => {
            this.switchLanguage('en');
        });

        document.getElementById('lang-ja').addEventListener('click', () => {
            this.switchLanguage('ja');
        });

        // ログイン関連
        document.getElementById('login-btn').addEventListener('click', () => {
            this.showLoginModal();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('login-form').addEventListener('submit', (e) => {
            this.handleLogin(e);
        });

        // モーダル関連
        document.querySelector('.close').addEventListener('click', () => {
            this.hideLoginModal();
        });

        document.getElementById('login-modal').addEventListener('click', (e) => {
            if (e.target.id === 'login-modal') {
                this.hideLoginModal();
            }
        });

        // 登録関連
        const showRegisterLink = document.getElementById('show-register');
        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideLoginModal();
                this.showRegisterModal();
            });
        }

        const showLoginLink = document.getElementById('show-login');
        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideRegisterModal();
                this.showLoginModal();
            });
        }

        const registerCloseBtn = document.getElementById('register-close');
        if (registerCloseBtn) {
            registerCloseBtn.addEventListener('click', () => {
                this.hideRegisterModal();
            });
        }

        // Register modal: disabled backdrop click-to-close for better UX during form entry
        // Users can still close via X button or "Login" link

        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                this.handleRegister(e);
            });
        }

        // 検索・フィルタ関連
        document.getElementById('search-input').addEventListener('input', () => {
            this.updateProductFilters();
        });

        document.getElementById('sort-select').addEventListener('change', () => {
            this.updateProductFilters();
        });

        // カテゴリタブ
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchCategory(tab.dataset.category);
            });
        });

        // チェックアウト
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.showCheckoutModal();
        });

        // 注文履歴
        document.getElementById('view-history-btn').addEventListener('click', () => {
            this.showOrderHistoryModal();
        });

        // ナビゲーション - 注文履歴
        const navOrderHistory = document.getElementById('nav-order-history');
        if (navOrderHistory) {
            navOrderHistory.addEventListener('click', (e) => {
                e.preventDefault();
                this.showOrderHistoryModal();
            });
        }

        // Todo関連 (only on pages with todo section)
        const addTodoBtn = document.getElementById('add-todo-btn');
        const todoInput = document.getElementById('todo-input');

        if (addTodoBtn) {
            addTodoBtn.addEventListener('click', () => {
                this.addTodo();
            });
        }

        if (todoInput) {
            todoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTodo();
                }
            });
        }
    }

    updateUI() {
        this.updateLanguageUI();
        this.updateAuthUI();
        this.renderProducts();
        this.renderCart();
        this.renderTodos();
    }

    switchLanguage(language) {
        this.appState.setLanguage(language);
        this.updateLanguageUI();
        this.updateUI();
    }

    updateLanguageUI() {
        const currentLang = this.appState.currentLanguage;

        // 言語ボタンのアクティブ状態を更新
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`lang-${currentLang}`).classList.add('active');

        // data-i18n属性を持つ要素のテキストを更新
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (i18n[currentLang] && i18n[currentLang][key]) {
                element.textContent = i18n[currentLang][key];
            }
        });

        // placeholder属性の更新
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (i18n[currentLang] && i18n[currentLang][key]) {
                element.setAttribute('placeholder', i18n[currentLang][key]);
            }
        });

        // HTMLのlang属性を更新
        document.documentElement.lang = currentLang;

        // 動的に生成されるコンテンツも更新
        this.renderProducts();
        this.renderCart();
        this.renderTodos();
    }

    t(key) {
        return i18n[this.appState.currentLanguage][key] || key;
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const username = document.getElementById('username');

        if (this.appState.currentUser) {
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            username.textContent = this.appState.currentUser.username;
            document.body.classList.add('logged-in');
        } else {
            loginBtn.style.display = 'block';
            userInfo.style.display = 'none';
            document.body.classList.remove('logged-in');
        }
    }

    showLoginModal() {
        const modal = document.getElementById('login-modal');
        this.openModal(modal);
    }

    hideLoginModal() {
        const modal = document.getElementById('login-modal');
        this.closeModal(modal);
        document.getElementById('login-form').reset();
    }

    showRegisterModal() {
        const modal = document.getElementById('register-modal');
        if (modal) {
            const errorDiv = document.getElementById('register-error');
            if (errorDiv) {
                errorDiv.style.display = 'none';
                errorDiv.textContent = '';
            }
            this.openModal(modal);
        }
    }

    hideRegisterModal() {
        const modal = document.getElementById('register-modal');
        if (modal) {
            this.closeModal(modal);
            document.getElementById('register-form').reset();
            const errorDiv = document.getElementById('register-error');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const errorDiv = document.getElementById('register-error');

        // Clear previous errors
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }

        // Validate
        if (username.length < 3) {
            this.showRegisterError(this.t('username_too_short'));
            return;
        }

        if (password.length < 10) {
            this.showRegisterError(this.t('password_too_short'));
            return;
        }

        // Check password complexity (letters, numbers, symbols)
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        if (!hasLetter || !hasNumber || !hasSymbol) {
            this.showRegisterError(this.t('password_complexity'));
            return;
        }

        if (password !== confirmPassword) {
            this.showRegisterError(this.t('password_mismatch'));
            return;
        }

        // Try API registration if available
        if (typeof apiClient !== 'undefined') {
            try {
                const result = await apiClient.register(username, email, password);
                // Auto-login after registration
                const loginResult = await apiClient.login(username, password);
                this.appState.currentUser = {
                    username: loginResult.user.username,
                    profile: loginResult.user.profile || {
                        displayName: '',
                        phone: '',
                        paymentMethod: ''
                    }
                };
                this.appState.saveToStorage();
                this.hideRegisterModal();
                this.updateUI();
                this.showMessage(this.t('registration_success'), 'success');
            } catch (error) {
                if (error.code === 'USERNAME_EXISTS') {
                    this.showRegisterError(this.t('username_taken'));
                } else if (error.code === 'EMAIL_EXISTS') {
                    this.showRegisterError(this.t('email_taken'));
                } else {
                    this.showRegisterError(error.message);
                }
            }
        } else {
            // Fallback: show message that server is required
            this.showRegisterError('Server connection required for registration');
        }
    }

    showRegisterError(message) {
        const errorDiv = document.getElementById('register-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    // バックエンド注文データ → フロントエンド形式に変換
    normalizeOrdersFromBackend(orders) {
        return orders.map(order => ({
            id: order.id,
            date: order.createdAt || order.date,
            items: order.items.map(item => ({
                id: item.productId || item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            total: order.total,
            shippingInfo: order.shippingAddress || order.shippingInfo || {},
            paymentMethod: order.paymentMethod,
            status: order.status
        }));
    }

    // フロントエンド注文データ → バックエンド形式に変換
    normalizeOrderForBackend(shippingInfo, paymentMethod) {
        return {
            items: this.appState.cart.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            shippingAddress: {
                name: shippingInfo.name,
                email: shippingInfo.email,
                phone: shippingInfo.phone,
                postalCode: shippingInfo.postalCode,
                address: shippingInfo.address
            },
            paymentMethod: paymentMethod
        };
    }

    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username-input').value;
        const password = document.getElementById('password-input').value;

        // Try API login first if available
        if (typeof apiClient !== 'undefined') {
            try {
                const result = await apiClient.login(username, password);
                this.appState.currentUser = {
                    username: result.user.username,
                    profile: result.user.profile || {
                        displayName: '',
                        phone: '',
                        paymentMethod: ''
                    }
                };
                this.appState.isBackendAuthenticated = true;

                // バックエンドから注文履歴を取得
                try {
                    const orders = await apiClient.getOrders();
                    this.appState.orders = this.normalizeOrdersFromBackend(orders);
                } catch (orderError) {
                    console.warn('Failed to fetch orders from backend:', orderError);
                    // 注文履歴の取得に失敗してもログインは成功とする
                }

                this.appState.saveToStorage();
                this.hideLoginModal();
                this.updateUI();
                this.showMessage(this.t('login_success'), 'success');
                return;
            } catch (error) {
                // If API fails with auth error, show error and return
                if (error.code !== 'NETWORK_ERROR') {
                    this.showMessage(this.t('login_error'), 'error');
                    return;
                }
                // Network error - fall through to demo mode login
                console.warn('Backend not available, falling back to demo mode');
            }
        }

        // Fallback to demo mode login (only demo user works)
        if (this.appState.login(username, password)) {
            this.hideLoginModal();
            this.updateUI();
            // Show demo mode warning
            this.showMessage(this.t('demo_mode_login'), 'info');
        } else {
            // For non-demo users without backend, show backend required message
            this.showMessage(this.t('backend_required'), 'error');
        }
    }

    logout() {
        // APIクライアントのトークンをクリア
        if (typeof apiClient !== 'undefined') {
            apiClient.clearAuth();
        }
        this.appState.isBackendAuthenticated = false;
        this.appState.orders = []; // ユーザー固有の注文履歴をクリア
        this.appState.logout();
        this.updateUI();
        this.showMessage(this.t('logout_success'), 'success');
    }

    updateProductFilters() {
        const searchTerm = document.getElementById('search-input').value;
        const category = this.appState.currentCategory;
        const sortBy = document.getElementById('sort-select').value;

        this.appState.filterProducts(searchTerm, category, sortBy);
        this.renderProducts();
    }

    switchCategory(category) {
        // カテゴリ状態を更新
        this.appState.setCategory(category);

        // タブのアクティブ状態を更新
        document.querySelectorAll('.category-tab').forEach(tab => {
            const isActive = tab.dataset.category === category;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // 商品一覧を更新
        this.updateProductFilters();
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        grid.innerHTML = '';

        this.appState.filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const productName = this.getProductName(product.name);
            const categoryName = this.getCategoryName(product.category);
            const loginRequiredTitle = this.t('login_required');

            // カテゴリー別アイコン
            const categoryIcons = {
                electronics: '<i class="fas fa-mobile-alt"></i>',
                clothing: '<i class="fas fa-tshirt"></i>',
                books: '<i class="fas fa-book"></i>',
                home: '<i class="fas fa-home"></i>'
            };
            const categoryIcon = categoryIcons[product.category] || '<i class="fas fa-tag"></i>';

            productCard.innerHTML = `
                <img src="${product.image}" alt="${escapeHTML(productName)}" class="product-image" loading="lazy">
                <div class="product-name">${escapeHTML(productName)}</div>
                <div class="product-price">¥${product.price.toLocaleString()}</div>
                <div class="product-category">${categoryIcon} ${escapeHTML(categoryName)}</div>
                <button class="btn btn-primary" onclick="ui.addToCart(${product.id})"
                        ${!this.appState.currentUser ? `disabled title="${escapeHTML(loginRequiredTitle)}"` : ''}>
                    <i class="fas fa-shopping-cart"></i> ${this.t('add_to_cart')}
                </button>
            `;
            grid.appendChild(productCard);
        });
    }

    renderRecommendedProducts() {
        const grid = document.getElementById('recommended-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const recommendedProducts = this.appState.getRecommendedProducts();

        recommendedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'recommended-card';

            const productName = this.getProductName(product.name);
            const categoryName = this.getCategoryName(product.category);
            const loginRequiredTitle = this.t('login_required');

            // カテゴリー別アイコン
            const categoryIcons = {
                electronics: '<i class="fas fa-mobile-alt"></i>',
                clothing: '<i class="fas fa-tshirt"></i>',
                books: '<i class="fas fa-book"></i>',
                home: '<i class="fas fa-home"></i>'
            };
            const categoryIcon = categoryIcons[product.category] || '<i class="fas fa-tag"></i>';

            productCard.innerHTML = `
                <img src="${product.image}" alt="${escapeHTML(productName)}" class="recommended-image" loading="lazy">
                <div class="recommended-content">
                    <div class="recommended-name">${escapeHTML(productName)}</div>
                    <div class="recommended-price">¥${product.price.toLocaleString()}</div>
                    <div class="recommended-category">${categoryIcon} ${escapeHTML(categoryName)}</div>
                    <button class="btn btn-primary" onclick="ui.addToCart(${product.id})"
                            ${!this.appState.currentUser ? `disabled title="${escapeHTML(loginRequiredTitle)}"` : ''}>
                        <i class="fas fa-shopping-cart"></i> ${this.t('add_to_cart')}
                    </button>
                </div>
            `;
            grid.appendChild(productCard);
        });
    }

    getProductName(japaneseName) {
        const currentLang = this.appState.currentLanguage;
        if (currentLang === 'en' && i18n.ja.product_names[japaneseName]) {
            return i18n.ja.product_names[japaneseName];
        }
        return japaneseName;
    }

    getCategoryName(category) {
        return this.t(category);
    }

    addToCart(productId) {
        if (!this.appState.currentUser) {
            this.showMessage(this.t('login_required'), 'error');
            return;
        }

        this.appState.addToCart(productId);
        this.renderCart();
        this.showMessage(this.t('product_added'), 'success');
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (this.appState.cart.length === 0) {
            cartItems.innerHTML = `<p class="empty-cart">${this.t('cart_empty')}</p>`;
            cartTotal.textContent = `${this.t('total')}: ¥0`;
            checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = '';
            this.appState.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                const itemName = this.getProductName(item.name);
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${escapeHTML(itemName)}</div>
                        <div class="cart-item-price">¥${item.price.toLocaleString()} × ${item.quantity}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="ui.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="ui.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="todo-btn" onclick="ui.removeFromCart(${item.id})" title="${this.t('delete')}">🗑️</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });

            cartTotal.textContent = `${this.t('total')}: ¥${this.appState.getCartTotal().toLocaleString()}`;
            checkoutBtn.disabled = false;
        }
    }

    updateQuantity(productId, newQuantity) {
        this.appState.updateCartQuantity(productId, newQuantity);
        this.renderCart();
    }

    removeFromCart(productId) {
        this.appState.removeFromCart(productId);
        this.renderCart();
        this.showMessage(this.t('product_removed'), 'success');
    }

    initializeCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        const closeBtn = document.getElementById('checkout-close');

        closeBtn.addEventListener('click', () => {
            this.hideCheckoutModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target.id === 'checkout-modal') {
                this.hideCheckoutModal();
            }
        });

        document.getElementById('shipping-next').addEventListener('click', () => {
            this.handleShippingNext();
        });

        document.getElementById('payment-back').addEventListener('click', () => {
            this.goToCheckoutStep(1);
        });

        document.getElementById('payment-next').addEventListener('click', () => {
            this.handlePaymentNext();
        });

        document.getElementById('confirm-back').addEventListener('click', () => {
            this.goToCheckoutStep(2);
        });

        document.getElementById('confirm-order').addEventListener('click', () => {
            this.handleConfirmOrder();
        });

        document.getElementById('close-checkout').addEventListener('click', () => {
            this.hideCheckoutModal();
        });
    }

    showCheckoutModal() {
        if (this.appState.cart.length === 0) return;

        this.currentCheckoutStep = 1;
        this.shippingFormData = {};
        this.paymentMethodData = null;

        document.getElementById('shipping-form').reset();
        document.getElementById('payment-form').reset();

        this.goToCheckoutStep(1);
        const modal = document.getElementById('checkout-modal');
        this.openModal(modal);
    }

    hideCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        this.closeModal(modal);
        this.goToCheckoutStep(1);
    }

    goToCheckoutStep(step) {
        this.currentCheckoutStep = step;

        document.querySelectorAll('.checkout-step-content').forEach(content => {
            content.style.display = 'none';
        });

        document.querySelectorAll('.step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });

        const targetContent = document.querySelector(`.checkout-step-content[data-step="${step}"]`);
        if (targetContent) {
            targetContent.style.display = 'block';
        }

        const targetStep = document.querySelector(`.step[data-step="${step}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
    }

    handleShippingNext() {
        const form = document.getElementById('shipping-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        this.shippingFormData = {
            name: document.getElementById('shipping-name').value,
            email: document.getElementById('shipping-email').value,
            phone: document.getElementById('shipping-phone').value,
            postalCode: document.getElementById('shipping-postal').value,
            address: document.getElementById('shipping-address').value
        };

        this.goToCheckoutStep(2);
    }

    handlePaymentNext() {
        const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedPayment) return;

        this.paymentMethodData = selectedPayment.value;
        this.renderOrderConfirmation();
        this.goToCheckoutStep(3);
    }

    renderOrderConfirmation() {
        const itemsList = document.getElementById('order-items-list');
        itemsList.innerHTML = '';

        this.appState.cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            const itemName = this.getProductName(item.name);
            itemDiv.innerHTML = `
                <span>${escapeHTML(itemName)} × ${item.quantity}</span>
                <span>¥${(item.price * item.quantity).toLocaleString()}</span>
            `;
            itemsList.appendChild(itemDiv);
        });

        document.getElementById('order-total-amount').textContent =
            `¥${this.appState.getCartTotal().toLocaleString()}`;

        const shippingInfo = document.getElementById('order-shipping-info');
        shippingInfo.innerHTML = `
            <p><strong>${this.t('full_name')}:</strong> ${escapeHTML(this.shippingFormData.name)}</p>
            <p><strong>${this.t('email')}:</strong> ${escapeHTML(this.shippingFormData.email)}</p>
            <p><strong>${this.t('phone')}:</strong> ${escapeHTML(this.shippingFormData.phone)}</p>
            <p><strong>${this.t('postal_code')}:</strong> ${escapeHTML(this.shippingFormData.postalCode)}</p>
            <p><strong>${this.t('address')}:</strong> ${escapeHTML(this.shippingFormData.address)}</p>
        `;

        const paymentInfo = document.getElementById('order-payment-info');
        paymentInfo.innerHTML = `
            <p>${this.t(this.paymentMethodData)}</p>
        `;
    }

    async handleConfirmOrder() {
        // バックエンド認証済みの場合はAPIで注文作成
        if (this.appState.isBackendAuthenticated && typeof apiClient !== 'undefined') {
            try {
                const orderData = this.normalizeOrderForBackend(
                    this.shippingFormData,
                    this.paymentMethodData
                );
                const backendOrder = await apiClient.createOrder(orderData);

                // バックエンドからの注文をローカルステートに追加
                const normalizedOrder = this.normalizeOrdersFromBackend([backendOrder])[0];
                this.appState.orders.push(normalizedOrder);
                this.appState.cart = []; // カートをクリア（バックエンドでもクリアされる）
                this.appState.saveToStorage();

                document.getElementById('order-number-display').textContent = backendOrder.id;
                this.renderCart();
                this.goToCheckoutStep(4);
                return;
            } catch (error) {
                console.error('Failed to create order via API:', error);
                // APIエラーの場合はローカルストレージにフォールバック
                this.showMessage('注文はローカルに保存されました（バックエンド接続不可）', 'warning');
            }
        }

        // フォールバック: localStorage保存（デモモード）
        const order = this.appState.createOrder(this.shippingFormData, this.paymentMethodData);

        document.getElementById('order-number-display').textContent = order.id;

        this.renderCart();
        this.goToCheckoutStep(4);
    }

    showOrderHistoryModal() {
        const modal = document.getElementById('order-history-modal');
        const closeBtn = document.getElementById('history-close');

        if (!closeBtn.hasAttribute('data-initialized')) {
            closeBtn.addEventListener('click', () => {
                this.hideOrderHistoryModal();
            });

            modal.addEventListener('click', (e) => {
                if (e.target.id === 'order-history-modal') {
                    this.hideOrderHistoryModal();
                }
            });

            closeBtn.setAttribute('data-initialized', 'true');
        }

        this.renderOrderHistory();
        this.openModal(modal);
    }

    hideOrderHistoryModal() {
        const modal = document.getElementById('order-history-modal');
        this.closeModal(modal);
    }

    renderOrderHistory() {
        const historyList = document.getElementById('order-history-list');
        historyList.innerHTML = '';

        if (this.appState.orders.length === 0) {
            historyList.innerHTML = `<div class="empty-history">${this.t('no_orders')}</div>`;
            return;
        }

        const sortedOrders = [...this.appState.orders].sort((a, b) => b.id - a.id);

        sortedOrders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-history-item';

            const orderDate = new Date(order.date).toLocaleDateString(
                this.appState.currentLanguage === 'ja' ? 'ja-JP' : 'en-US'
            );

            let itemsHTML = '';
            order.items.forEach(item => {
                const itemName = this.getProductName(item.name);
                itemsHTML += `
                    <div class="order-item-line">
                        <span>${escapeHTML(itemName)} × ${item.quantity}</span>
                        <span>¥${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `;
            });

            orderDiv.innerHTML = `
                <div class="order-header">
                    <div class="order-id">${this.t('order_number')}: ${order.id}</div>
                    <div class="order-date-text">${this.t('order_date')}: ${orderDate}</div>
                </div>
                <div class="order-items-summary">
                    ${itemsHTML}
                </div>
                <div class="order-total-line">
                    <span>${this.t('total')}:</span>
                    <span>¥${order.total.toLocaleString()}</span>
                </div>
                <div class="order-shipping-summary">
                    <div><strong>${this.t('shipping_to')}:</strong> ${escapeHTML(order.shippingInfo.name)}</div>
                    <div>${escapeHTML(order.shippingInfo.address)}</div>
                    <div><strong>${this.t('payment')}:</strong> ${this.t(order.paymentMethod)}</div>
                </div>
            `;

            historyList.appendChild(orderDiv);
        });
    }

    addTodo() {
        const input = document.getElementById('todo-input');
        const text = input.value.trim();

        if (!this.appState.currentUser) {
            this.showMessage(this.t('login_required'), 'error');
            return;
        }

        if (text) {
            this.appState.addTodo(text);
            input.value = '';
            this.renderTodos();
            this.showMessage(this.t('memo_added'), 'success');
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todo-list');
        // Skip if todo section doesn't exist on this page
        if (!todoList) return;

        todoList.innerHTML = '';

        if (this.appState.todos.length === 0) {
            todoList.innerHTML = `<li class="todo-item"><span class="todo-text">${this.t('memo_empty')}</span></li>`;
            return;
        }

        this.appState.todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = 'todo-item';
            const toggleTitle = todo.completed ? this.t('incomplete') : this.t('complete');
            todoItem.innerHTML = `
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${escapeHTML(todo.text)}</span>
                <div class="todo-controls">
                    <button class="todo-btn" onclick="ui.toggleTodo(${todo.id})" title="${toggleTitle}">
                        ${todo.completed ? '↩️' : '✅'}
                    </button>
                    <button class="todo-btn" onclick="ui.deleteTodo(${todo.id})" title="${this.t('delete')}">🗑️</button>
                </div>
            `;
            todoList.appendChild(todoItem);
        });
    }

    toggleTodo(todoId) {
        this.appState.toggleTodo(todoId);
        this.renderTodos();
    }

    deleteTodo(todoId) {
        this.appState.deleteTodo(todoId);
        this.renderTodos();
        this.showMessage(this.t('memo_deleted'), 'success');
    }

    showMessage(message, type = 'info') {
        // 既存のメッセージがあれば削除
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;

        // アクセシビリティ: aria-live リージョン (WCAG 4.1.3)
        if (type === 'error') {
            messageDiv.setAttribute('role', 'alert');
            messageDiv.setAttribute('aria-live', 'assertive');
        } else {
            messageDiv.setAttribute('role', 'status');
            messageDiv.setAttribute('aria-live', 'polite');
        }

        messageDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 12px 20px;
            border-radius: 4px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            z-index: 1001;
            font-size: 14px;
            max-width: 300px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// アプリケーション初期化
let appState;
let ui;

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        i18n,
        AppState,
        UIManager,
        escapeHTML
    };
} else {
    // Browser environment
    document.addEventListener('DOMContentLoaded', () => {
        appState = new AppState();
        ui = new UIManager(appState);
    });
}