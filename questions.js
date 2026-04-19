/**
 * AWS学習クイズアプリ — 問題データファイル
 *
 * 目的: AWSサービスの組み合わせからユースケースを答える逆引き形式のクイズデータ。
 *       暗記ではなく「なぜこの組み合わせがこのユースケースを実現するのか」を
 *       深く理解させることを目的とする。
 *
 * 作成者: Sekimoto Naoto
 * 作成日: 2026-04-19
 */

const QUESTIONS = [
  // ============================================================
  // Basic（基礎）
  // ============================================================
  {
    id: 1,
    level: 'basic',
    category: 'サーバーレス',
    services: ['API Gateway', 'Lambda', 'DynamoDB'],
    usecase: 'サーバーレス REST API を構築し、リクエストを受けてデータを読み書きする',
    roles: {
      'API Gateway': 'HTTP リクエストの受口。認証・レート制限・ルーティングを担当',
      'Lambda':      'ビジネスロジックを実行。サーバー管理不要で自動スケール',
      'DynamoDB':    'データを永続化。スキーマレスで大規模アクセスにも対応'
    },
    flow: 'クライアント → API Gateway（受付・認証）→ Lambda（処理）→ DynamoDB（保存）',
    why: 'この3つを組み合わせることで、サーバーを1台も管理せずにスケーラブルなAPIが作れる。アクセスが急増しても各サービスが自動でスケールするため、キャパシティ計画が不要になる。',
    tip: '管理するサーバーがないためインフラコストを抑えられる。リクエスト数に比例した従量課金。'
  },
  {
    id: 2,
    level: 'basic',
    category: 'コンテンツ配信',
    services: ['S3', 'CloudFront'],
    usecase: '静的ウェブサイトをエッジキャッシュで世界中に高速配信する',
    roles: {
      'S3':          '静的ファイル（HTML/CSS/JS/画像）のオリジンストレージとして機能',
      'CloudFront':  '世界400箇所以上のエッジロケーションにコンテンツをキャッシュして低レイテンシ配信'
    },
    flow: 'クライアント → CloudFront（エッジキャッシュ）→ S3（オリジン）',
    why: 'S3はストレージコストが低くHTTPSも設定できるが、物理距離によるレイテンシが生じる。CloudFrontが世界中のエッジにキャッシュを置くことで、ユーザーに最も近い拠点から配信でき応答速度が大幅に向上する。',
    tip: 'CloudFront + S3 はサーバーレス静的ホスティングの定番。HTTPS化もCloudFrontで完結する。'
  },
  {
    id: 3,
    level: 'basic',
    category: 'イベント駆動',
    services: ['S3', 'Lambda', 'SNS'],
    usecase: 'ファイルアップロードをトリガーに処理を実行し、結果を関係者に通知する',
    roles: {
      'S3':     'ファイルのアップロード先。オブジェクト作成イベントをトリガーとして発火',
      'Lambda': 'S3イベントを受け取ってビジネスロジック（変換・検証など）を実行',
      'SNS':    '処理完了後にメール・SMS・他サービスへ通知をファンアウト配信'
    },
    flow: 'ユーザー → S3（アップロード）→ Lambda（処理）→ SNS（通知）→ 複数の宛先',
    why: 'S3のイベント通知でLambdaを起動すれば、アップロードのたびに自動で処理が走る。SNSを使うことで、メール・SMS・SQS・別のLambdaなど複数の宛先に同時通知するファンアウトが簡単に実現できる。',
    tip: 'S3→Lambda→SNS はサーバーレスなイベント駆動の基本パターン。ポーリング不要で即時反応。'
  },
  {
    id: 4,
    level: 'basic',
    category: '高可用性',
    services: ['EC2', 'ELB'],
    usecase: '複数サーバーにトラフィックを分散し、障害時も自動で切り替えて可用性を高める',
    roles: {
      'EC2':  'アプリケーションを実行するサーバー。複数台を並べることで冗長化',
      'ELB':  'トラフィックを複数EC2に均等分散。ヘルスチェックで障害インスタンスを自動除外'
    },
    flow: 'クライアント → ELB（分散・ヘルスチェック）→ 複数台の EC2（処理）',
    why: '1台のEC2に全トラフィックが集中するとSPOF（単一障害点）になる。ELBを前段に置くことで負荷を均等に分散し、1台が落ちても他のEC2に自動フェイルオーバーするため、可用性とスケーラビリティが向上する。',
    tip: 'ELBはALB（HTTP/S）・NLB（TCP）・GLBの3種類。WebアプリではALBが最も一般的。'
  },
  {
    id: 5,
    level: 'basic',
    category: 'メッセージング',
    services: ['SQS', 'Lambda'],
    usecase: '非同期キューでメッセージを蓄積し、Lambdaが順次取り出して処理する',
    roles: {
      'SQS':    'メッセージを耐久性高くキューイング。処理が失敗してもメッセージは保持',
      'Lambda': 'SQSをポーリングしてメッセージを取り出し、バッチ単位で処理'
    },
    flow: '送信者 → SQS（キュー）← Lambda（ポーリング・処理）',
    why: 'SQSがメッセージをバッファするため、送信者と処理者を疎結合にできる。処理が遅延しても送信側は影響を受けない。Lambdaが自動でスケールするため、急激な流入にも対応できる。',
    tip: 'SQSの可視性タイムアウト内に処理が終わらないとメッセージが再配信される。DLQと組み合わせると万全。'
  },
  {
    id: 6,
    level: 'basic',
    category: 'バッチ処理',
    services: ['EventBridge', 'Lambda'],
    usecase: 'スケジュールに従って定期バッチ処理を自動実行する',
    roles: {
      'EventBridge': 'cron式またはrate式でスケジュールを定義し、指定時刻にイベントを発火',
      'Lambda':      'EventBridgeのイベントを受け取ってバッチロジックを実行。サーバー管理不要'
    },
    flow: 'EventBridge（スケジュール発火）→ Lambda（バッチ処理実行）',
    why: 'EventBridgeのスケジュールルールはcron式に対応し、任意のタイミングでLambdaを呼び出せる。EC2でcronジョブを動かすよりも管理が単純で、実行時間だけ課金されるためコスト効率が高い。',
    tip: 'EventBridgeは旧CloudWatch Events。cron(0 9 * * ? *) のようにUTCで記述する点に注意。'
  },
  {
    id: 7,
    level: 'basic',
    category: '認証・認可',
    services: ['Cognito', 'API Gateway'],
    usecase: 'ユーザー認証機能を持つAPIを構築し、認証済みユーザーのみアクセスを許可する',
    roles: {
      'Cognito':     'ユーザーのサインアップ・サインイン・トークン発行を管理するIDプロバイダー',
      'API Gateway': 'CognitoのJWTトークンをオーソライザーで検証し、未認証リクエストを拒否'
    },
    flow: 'クライアント → Cognito（認証・トークン取得）→ API Gateway（トークン検証）→ バックエンド',
    why: 'Cognitoがユーザー管理とトークン発行を担うため、自前で認証システムを実装する必要がない。API Gatewayのオーソライザー設定でJWT検証を自動化できるため、バックエンドの各Lambdaで認証コードを書かずに済む。',
    tip: 'CognitoはソーシャルログインやMFAにも対応。Hosted UIを使えばログイン画面も不要。'
  },
  {
    id: 8,
    level: 'basic',
    category: 'セキュリティ',
    services: ['CloudFront', 'WAF'],
    usecase: 'エッジロケーションでSQLインジェクションやDDoS攻撃をフィルタリングする',
    roles: {
      'CloudFront': 'エッジロケーションでコンテンツを配信。WAFルールをアタッチできる前段',
      'WAF':        'SQLインジェクション・XSS・IP制限など細かなルールで悪意あるリクエストをブロック'
    },
    flow: '攻撃者/クライアント → CloudFront + WAF（エッジで検査・ブロック）→ オリジン',
    why: 'WAFをCloudFrontにアタッチすると、悪意あるリクエストがオリジンサーバーに到達する前にエッジで遮断できる。DDoSの場合もエッジで吸収するためオリジンの負荷を防げる。Shield Standardも自動で有効になる。',
    tip: 'WAFはALBやAPI Gatewayにも直接アタッチ可能。CloudFront経由にすることでグローバルに防御できる。'
  },
  {
    id: 9,
    level: 'basic',
    category: 'データベース',
    services: ['RDS', 'Read Replica'],
    usecase: '読み取り専用レプリカで参照クエリを分散し、DBの読み取り負荷を軽減する',
    roles: {
      'RDS':          'プライマリDBとして書き込みを集中管理。マルチAZで高可用性を確保',
      'Read Replica': 'プライマリから非同期でレプリケーション。SELECTクエリをオフロードする読み取り専用副本'
    },
    flow: '書き込み → RDS Primary → Read Replica（非同期レプリケーション）← 読み取り',
    why: 'レポートやダッシュボードなど読み取りが多いアプリでは、Primaryへの負荷が集中しがち。Read Replicaにクエリを振り分けることで、Primary本来の書き込み処理を圧迫せずにスループットを拡大できる。',
    tip: 'Read Replicaは最大5台（MySQLは15台）まで作成可能。非同期のため若干のレプリケーション遅延あり。'
  },
  {
    id: 10,
    level: 'basic',
    category: 'ストレージ',
    services: ['S3', 'S3 Glacier'],
    usecase: '頻繁にアクセスしないデータをライフサイクルポリシーで自動的に低コスト層に移行して長期保存する',
    roles: {
      'S3':         '頻繁にアクセスするデータの標準ストレージ。ライフサイクルルールを設定できる',
      'S3 Glacier': 'アクセス頻度が極めて低いデータの超低コスト長期アーカイブ層'
    },
    flow: 'S3 Standard → （ライフサイクルポリシー）→ S3 Glacier（数日〜数年保存）',
    why: 'S3 Standardは高可用・高スループットだがストレージ費用が高め。使わなくなったデータをGlacierに自動移行することで、コンプライアンス要件を満たしながらストレージコストを最大80〜95%削減できる。',
    tip: 'Glacier Instant RetrievalはミリSecond取り出し可能。Deep Archiveは最安だが取り出しに12時間かかる。'
  },

  // ============================================================
  // Intermediate（中級）
  // ============================================================
  {
    id: 11,
    level: 'intermediate',
    category: 'メッセージング',
    services: ['Lambda', 'SQS', 'DLQ'],
    usecase: '処理失敗したメッセージをデッドレターキューに退避して後から安全に再処理する',
    roles: {
      'Lambda': 'SQSからメッセージを取得して処理。例外が起きても制御された方法で失敗させる',
      'SQS':    '処理待ちメッセージをキューイング。最大受信数を超えたメッセージをDLQに転送',
      'DLQ':    '指定回数リトライしても処理できなかった「問題メッセージ」だけを隔離保管'
    },
    flow: 'SQS（メインキュー）→ Lambda（処理失敗）→ 最大受信数超過 → DLQ（退避）',
    why: 'エラーメッセージを通常キューに残したままにすると正常メッセージの処理を妨げる。DLQに分離することで、正常フローを止めずに問題メッセージの調査・再処理を安全に行える。再投入もDLQからSQSに戻すだけ。',
    tip: 'DLQは別のSQSキュー。maxReceiveCountで何回失敗したらDLQに移すかを設定できる。'
  },
  {
    id: 12,
    level: 'intermediate',
    category: 'ワークフロー',
    services: ['Step Functions', 'Lambda'],
    usecase: '複数Lambdaを順序・条件分岐・並列処理を定義したワークフローで協調動作させる',
    roles: {
      'Step Functions': 'ステートマシンとしてワークフローの順序・分岐・並列・エラー処理を視覚的に定義',
      'Lambda':         '各ステップで呼び出される処理単位。責務を小さく分割して実装'
    },
    flow: 'Step Functions（ステートマシン）→ Lambda-A（ステップ1）→ Lambda-B（ステップ2）→ ...',
    why: '複数のLambdaを自前でチェーンすると、エラー時のリトライや状態管理が複雑になる。Step Functionsがオーケストレーターとして状態・エラー・タイムアウトを管理するため、各Lambdaはビジネスロジックに集中できる。',
    tip: 'Standard WorkflowはステートをS3に永続化。Express Workflowは高スループット・短時間処理向け。'
  },
  {
    id: 13,
    level: 'intermediate',
    category: 'ストリーミング',
    services: ['Kinesis', 'Lambda'],
    usecase: '大量のストリームデータをリアルタイムに取り込み、継続的に処理・分析する',
    roles: {
      'Kinesis': 'IoTセンサー・アクセスログなど大量データを高スループットでリアルタイム取り込み',
      'Lambda':  'Kinesisシャードをトリガーにレコードをバッチ取得してリアルタイム処理'
    },
    flow: 'データソース → Kinesis Data Streams（シャード）→ Lambda（リアルタイム処理）',
    why: 'バッチ処理ではデータが溜まるまで待つ遅延が生じる。Kinesisはストリームを継続的に保持し、Lambdaがシャードを読み続けることで処理をリアルタイム化できる。スループットはシャード数で線形スケール。',
    tip: 'シャードは1秒あたり1MB書き込み・2MB読み取り。データ量に応じてシャード数を増やすことでスケール。'
  },
  {
    id: 14,
    level: 'intermediate',
    category: 'コンテナ',
    services: ['ECR', 'ECS Fargate'],
    usecase: 'コンテナイメージをレジストリで管理し、サーバーレスでコンテナを実行する',
    roles: {
      'ECR':        'DockerイメージをAWS上にプライベート保管。脆弱性スキャンも提供',
      'ECS Fargate': 'EC2を管理せずにコンテナを実行。CPUとメモリを指定するだけで起動・スケール'
    },
    flow: 'ビルド → ECR（イメージPush）→ ECS Fargate（イメージPull・コンテナ起動）',
    why: 'Fargateはホストサーバーの管理が不要なため、EC2ベースのECSよりも運用コストが低い。ECRをプライベートレジストリにすることでVPC内からのアクセスに限定でき、セキュアなコンテナデプロイが実現できる。',
    tip: 'FargateはECSとEKS両方で利用可能。タスク定義でCPU/メモリを設定し、使った分だけ課金。'
  },
  {
    id: 15,
    level: 'intermediate',
    category: 'データベース',
    services: ['ElastiCache', 'RDS'],
    usecase: 'DBへの重複した読み取りクエリをインメモリキャッシュで高速化してレイテンシを下げる',
    roles: {
      'ElastiCache': 'RedisまたはMemcachedとして動作するインメモリキャッシュ。ミリ秒以下で応答',
      'RDS':         '永続的なリレーショナルDBとしてデータを管理。読み取りが集中するとボトルネックに'
    },
    flow: 'アプリ → ElastiCache（キャッシュHit）→ 即時返却 / キャッシュMiss → RDS → キャッシュ更新',
    why: 'RDSへの同じクエリが繰り返し発行されるとDBが高負荷になる。ElastiCacheがその結果をキャッシュすることで、DBにアクセスせずに応答できる割合（キャッシュヒット率）が上がり、レイテンシとDB負荷を劇的に削減できる。',
    tip: 'キャッシュが古いと整合性問題になる。TTL設定とキャッシュ無効化戦略をアプリ側で設計すること。'
  },
  {
    id: 16,
    level: 'intermediate',
    category: '監視・自動化',
    services: ['CloudWatch', 'SNS', 'Lambda'],
    usecase: 'メトリクス異常をアラームで検知し、通知と同時に自動修復アクションを実行する',
    roles: {
      'CloudWatch': 'メトリクス・ログを収集し、閾値を超えるとアラームを発火',
      'SNS':        'アラームを受け取り、メール・Slack通知や次のアクションへファンアウト',
      'Lambda':     'SNSイベントを受け取り、自動スケーリング・再起動などの修復処理を実行'
    },
    flow: 'CloudWatch（異常検知）→ SNS（通知ファンアウト）→ 管理者メール + Lambda（自動対応）',
    why: '人手による監視では対応に時間がかかる。CloudWatchが自動検知し、SNSが人への通知とLambdaへのトリガーを同時に行うことで、障害検知から自動修復までを人が介入せずに完結させることができる。',
    tip: 'CloudWatchアラームはOK→ALARM→INSUFFICIENT_DATAの3状態。Composite Alarmで複合条件も設定可能。'
  },
  {
    id: 17,
    level: 'intermediate',
    category: 'データベース',
    services: ['Lambda', 'RDS Proxy'],
    usecase: 'LambdaからRDSへの大量コネクションをプールして枯渇を防ぎDBを保護する',
    roles: {
      'Lambda':    '大量の同時起動で1関数につき1コネクションをRDSに張ろうとしてコネクション数が爆発',
      'RDS Proxy': 'コネクションをプールして多数のLambdaが少数の物理コネクションを共有できるようにする'
    },
    flow: 'Lambda（多数）→ RDS Proxy（コネクションプール・多重化）→ RDS（少数の接続）',
    why: 'Lambdaは同時実行数が数千になりうるため、各Lambdaが直接RDSに接続するとコネクション上限に達してエラーが起きる。RDS Proxyがコネクションを束ねることで、RDS側のコネクション数を大幅に削減できる。',
    tip: 'RDS ProxyはIAM認証やSecrets Managerとの統合もサポート。Lambda×RDS構成では必須と考えてよい。'
  },
  {
    id: 18,
    level: 'intermediate',
    category: 'イベント駆動',
    services: ['DynamoDB Streams', 'Lambda'],
    usecase: 'DBの変更イベントをリアルタイムに捕捉して別システムに同期・伝播させる',
    roles: {
      'DynamoDB Streams': 'テーブルへの作成・更新・削除をキャプチャしてイベントストリームとして提供',
      'Lambda':           'ストリームからレコードを読み取り、検索インデックス更新や他DBへの反映を実行'
    },
    flow: 'DynamoDB（データ変更）→ DynamoDB Streams（変更キャプチャ）→ Lambda（同期処理）',
    why: 'ポーリングで変更を検知すると遅延・負荷・コストが増える。DynamoDB Streamsは変更発生と同時にLambdaを起動するため、リアルタイムかつ効率的に他のサービス（Elasticsearch・別RDSなど）に変更を伝播できる。',
    tip: 'Streamsには変更前後の画像を含めることができ、変更差分を正確に把握できる。保持期間は24時間。'
  },
  {
    id: 19,
    level: 'intermediate',
    category: 'セキュリティ',
    services: ['Secrets Manager', 'Lambda'],
    usecase: 'APIキーやDB接続情報をコードに書かず、実行時にセキュアに取得して利用する',
    roles: {
      'Secrets Manager': 'シークレットを暗号化保管し、自動ローテーションも提供。IAMで細かくアクセス制御',
      'Lambda':          '実行時にSecrets Manager APIを呼び出してシークレットを取得。コードには秘密情報を含まない'
    },
    flow: 'Lambda（起動）→ Secrets Manager（IAM認証で取得）→ シークレット値を使って処理',
    why: 'APIキーやパスワードをコードやenv変数にハードコードすると、リポジトリ漏洩やデプロイ設定の流出リスクがある。Secrets Managerを使うことで、シークレットの一元管理・監査ログ・自動ローテーションが実現できる。',
    tip: 'Lambda実行ロールにSecrets Managerの読み取り権限を付与する必要がある。Parameter Storeより多機能だが有料。'
  },
  {
    id: 20,
    level: 'intermediate',
    category: 'AI・機械学習',
    services: ['S3', 'Lambda', 'Rekognition'],
    usecase: '画像アップロードを契機にAI画像解析を自動実行し、ラベル付けや不適切コンテンツ検出を行う',
    roles: {
      'S3':          '画像のアップロード先。オブジェクト作成イベントでLambdaをトリガー',
      'Lambda':      'S3イベントを受けてRekognition APIに画像を渡し、解析結果を処理',
      'Rekognition': 'AWSのコンピュータービジョンサービス。ラベル検出・顔認識・不適切コンテンツ判定などを提供'
    },
    flow: 'ユーザー → S3（画像アップロード）→ Lambda（API呼び出し）→ Rekognition（AI解析）→ 結果保存',
    why: '機械学習モデルを自分で構築・維持するのはコストが高い。RekognitionのAPIを呼ぶだけで高精度な画像解析が使えるため、モデル管理なしにAI機能をサーバーレスで実装できる。画像量に応じた従量課金なのも利点。',
    tip: 'Rekognitionは動画解析にも対応。Content Moderationで不適切コンテンツを自動フィルタリングできる。'
  },

  // ============================================================
  // Advanced（上級）
  // ============================================================
  {
    id: 21,
    level: 'advanced',
    category: 'コンテナ',
    services: ['EKS', 'ECR'],
    usecase: 'Kubernetesでコンテナをオーケストレーションし、AWSマネージド環境で本番ワークロードを安全に運用する',
    roles: {
      'EKS': 'AWSがコントロールプレーンを管理するKubernetes環境。IAMや他AWSサービスとの統合が容易',
      'ECR': 'コンテナイメージを安全に保管し、EKSがPod起動時にIAM認証でPullできるプライベートレジストリ'
    },
    flow: 'コードPush → CI/CDでイメージビルド → ECR（Push）→ EKS（Pull・Pod起動・スケーリング）',
    why: 'ECSより複雑だが、Kubernetesの豊富なエコシステム・細かなスケーリング制御・マルチクラウド移植性が必要な場合にEKSを選ぶ。ECRをレジストリにすることでVPC内の閉じたネットワークでイメージを管理できる。',
    tip: 'Fargate on EKSならノード管理も不要。NodeグループはManagedとSelf-managedが選べる。'
  },
  {
    id: 22,
    level: 'advanced',
    category: 'CI/CD',
    services: ['CodePipeline', 'CodeBuild', 'ECR'],
    usecase: 'コードプッシュから自動でビルド・テスト・コンテナイメージ作成・レジストリ登録までのCI/CDパイプラインを構築する',
    roles: {
      'CodePipeline': 'ソース取得→ビルド→デプロイのパイプラインフローを定義・オーケストレーション',
      'CodeBuild':    'コードをビルド・テストし、Dockerイメージを作成するマネージドビルド環境',
      'ECR':          'CodeBuildが作成したイメージをタグ付きで保管。ECSやEKSへのデプロイ元となる'
    },
    flow: 'GitPush → CodePipeline → CodeBuild（ビルド・テスト・Docker build）→ ECR（Push）→ ECSデプロイ',
    why: '手動デプロイはヒューマンエラーと時間ロスが大きい。CodePipelineがフローを自動化することで、コードPushから本番デプロイまでを標準化・自動化し、リリース品質と速度を両立できる。',
    tip: 'CodePipelineはGitHub・CodeCommit・S3をソースに設定可能。承認ステージを挟んで手動ゲートも設けられる。'
  },
  {
    id: 23,
    level: 'advanced',
    category: 'ネットワーク',
    services: ['VPC', 'NAT Gateway'],
    usecase: 'プライベートサブネット内のリソースがインターネットに安全にアクセスできるようにしながら、外部からの直接アクセスは遮断する',
    roles: {
      'VPC':         'プライベートな仮想ネットワーク環境。パブリック/プライベートサブネットを分離',
      'NAT Gateway': 'パブリックサブネットに配置。プライベートサブネットの外向き通信を中継し、返り通信のみ許可'
    },
    flow: 'プライベートEC2/Lambda → NAT Gateway（パブリックサブネット）→ インターネット（一方向）',
    why: 'DBやアプリサーバーをプライベートサブネットに配置することで外部からの侵入経路を排除できる。しかし外部APIやパッケージ取得には外向き通信が必要なため、NAT Gatewayが内から外へのみ通信を許可する役割を担う。',
    tip: 'NAT GatewayはAZ単位で必要。高可用性のために各AZに1つ配置するのがベストプラクティス。料金は転送量に注意。'
  },
  {
    id: 24,
    level: 'advanced',
    category: '生成AI',
    services: ['Lambda', 'Bedrock'],
    usecase: 'サーバーレス関数から基盤モデルAPIを呼び出して生成AIを活用したアプリを構築する',
    roles: {
      'Lambda':  'ユーザーリクエストを受け取りBedrockのAPIを呼び出す実行環境。サーバー管理不要',
      'Bedrock': 'AWSが提供する生成AI基盤モデル群。Claude・Llama・Titanなどを統一APIで利用可能'
    },
    flow: 'クライアント → API Gateway → Lambda → Bedrock（モデル呼び出し）→ 生成結果返却',
    why: 'LLMを自前で運用するには大規模なGPUインフラが必要だが、Bedrockを使えばAPIコールだけで高性能な生成AIを利用できる。Lambdaで呼び出すことでサーバーレスのスケーラビリティとBedrockの生成AI能力を掛け合わせられる。',
    tip: 'BedrockはKnowledge Bases・Agentsも提供。IAMロールでモデルへのアクセスを制御できる。'
  },
  {
    id: 25,
    level: 'advanced',
    category: 'データベース',
    services: ['Aurora Global Database'],
    usecase: '複数リージョンにDBレプリカを展開し、低レイテンシの読み取りとリージョン障害時の高速フェイルオーバーを実現する',
    roles: {
      'Aurora Global Database': 'プライマリリージョンのAuroraから1秒未満で別リージョンにレプリケーション。リージョン障害時は副リージョンを数分で昇格可能'
    },
    flow: 'プライマリリージョン（書き込み）→ Aurora Global DB（1秒未満で同期）→ セカンダリリージョン（ローカル読み取り）',
    why: 'グローバルサービスでは地理的に離れたユーザーへの高レイテンシが課題になる。Aurora Global Databaseは各リージョンに読み取りエンドポイントを置くことで、ユーザーが最寄りのリージョンから低レイテンシで参照できる。加えてリージョン障害時のRPO＜1秒・RTO＜1分を実現する。',
    tip: 'Aurora Global Databaseはリージョン間のレプリケーションをストレージ層で行うため、レプリカラグが最小限。最大5リージョンまで追加可能。'
  },

  // 追加問題（全体の厚みを増すため）
  {
    id: 26,
    level: 'basic',
    category: 'コンピューティング',
    services: ['EC2', 'Auto Scaling', 'ELB'],
    usecase: '負荷に応じてサーバー台数を自動で増減させ、コストと可用性を同時に最適化する',
    roles: {
      'EC2':          'アプリケーションを実行するスケーラブルなサーバーインスタンス',
      'Auto Scaling': 'CPUやリクエスト数などのメトリクスを監視し、EC2台数を自動で増減',
      'ELB':          '増減するEC2インスタンスに対してトラフィックを自動で振り分け'
    },
    flow: '負荷増加 → CloudWatchメトリクス → Auto Scaling（EC2追加）→ ELB（新インスタンスに振り分け）',
    why: 'EC2台数を固定すると過剰プロビジョニングかリソース不足のどちらかになる。Auto Scalingが需要に合わせてリアルタイムにEC2を増減し、ELBが均等に振り分けることで、コスト効率と処理能力を同時に最適化できる。',
    tip: 'スケールアウト（増加）は速く・スケールイン（削減）は遅くするクールダウン設定で安定性を保つ。'
  },
  {
    id: 27,
    level: 'intermediate',
    category: 'ストレージ',
    services: ['S3', 'Athena'],
    usecase: 'S3に蓄積した大量のログやデータをサーバーレスSQLで直接クエリして分析する',
    roles: {
      'S3':     'CSVやParquet形式のデータレイクとして大量データを低コストに蓄積',
      'Athena': 'S3上のデータにSQLをそのまま実行。サーバー不要でデータ量に応じたスキャン課金'
    },
    flow: 'データ → S3（データレイク）← Athena（SQL実行・スキャン）→ 結果返却',
    why: 'データウェアハウスを別途立てずにS3のデータをSQLで分析できるため、初期コストがゼロ。Parquet形式にすることで列指向のスキャンになり、不要な列を読み飛ばしてクエリコストを削減できる。',
    tip: 'Athenaはスキャンしたデータ量1TBあたり約$5。Parquet＋パーティショニングでコストを1/10以下に抑えられる。'
  },
  {
    id: 28,
    level: 'advanced',
    category: 'セキュリティ',
    services: ['IAM', 'STS', 'Organizations'],
    usecase: '複数AWSアカウントを一元管理し、クロスアカウントで最小権限の一時的な認証情報を安全に発行する',
    roles: {
      'IAM':           '各アカウント内のユーザー・ロール・ポリシーを管理。きめ細かな権限制御を提供',
      'STS':           '一時的なセキュリティ認証情報（トークン）を発行。クロスアカウントの AssumeRole を実現',
      'Organizations': '複数AWSアカウントを組織として一元管理。SCP（サービスコントロールポリシー）で権限の上限を設定'
    },
    flow: 'ユーザー → STS AssumeRole → 別アカウントの一時クレデンシャル → 対象リソースにアクセス',
    why: '長期的なアクセスキーを使い回すのはリスクが高い。STSの一時クレデンシャルは有効期限が短く、漏洩しても被害を限定できる。OrganizationsのSCPで組織全体に許可する操作の上限を設けることで、ガバナンスを担保できる。',
    tip: 'Organizationsでは管理アカウントからSCPを展開。SCPはIAMポリシーと組み合わせて作用し、どちらかでDenyされたら拒否される。'
  }
];

if (typeof module !== 'undefined') module.exports = { QUESTIONS };
