<?php

/** @var \yii\web\View $this */
/** @var string $content */

use common\widgets\Alert;
use frontend\assets\AppAsset;
use yii\bootstrap4\Breadcrumbs;
use yii\bootstrap4\Html;
use yii\bootstrap4\Nav;
use yii\bootstrap4\NavBar;

AppAsset::register($this);

?>

<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>" class="h-100">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <?php $this->registerCsrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>

<body class="d-flex flex-column h-100">
<?php $this->beginBody(); ?>

<div class="wrap">
    <?php
    NavBar::begin([
        'brandLabel' => Yii::$app->name,
        'brandUrl' => Yii::$app->homeUrl,
        'options' => [
            'class' => 'navbar navbar-expand-md navbar-dark bg-dark fixed-top',
        ],
    ]);

    $menuItems = [];
    $menuItems[] = ['label' => 'О проекте', 'url' => ['/site/about']];

    $userRoles = Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());

    if (isset($userRoles['author']) || isset($userRoles['admin'])) {
        $menuItems[] = ['label' => 'Мои публикации', 'url' => ['/site/publications']];
    }
    echo Nav::widget([
        'options' => ['class' => 'navbar-nav navbar-right'],
        'items' => $menuItems
    ]);

    $authenticationItems = [];

    if (Yii::$app->user->isGuest) {
        $authenticationItems[] = ['label' => 'Регистрация', 'url' => ['/site/signup']];
        $authenticationItems[] = ['label' => 'Вход', 'url' => ['/site/login']];
    } else {
        //$authenticationItems[] = ['label' => 'Мои публикации', 'url' => ['/gallery/publications']];
        $authenticationItems[] = '<li>'
            . Html::beginForm(['/site/logout'], 'post')
            . Html::submitButton(
                'Выход (' . Yii::$app->user->identity->email . ')',
                //'Выход',
                ['class' => 'btn btn-light logout']
            )
            . Html::endForm()
            . '</li>';
    }

    echo Nav::widget([
        'options' => ['class' => 'navbar-nav ml-auto'],
        'items' => $authenticationItems,
    ]);
    NavBar::end();
    ?>

</div>


<main role="main" class="flex-shrink-0">
    <div class="container" style="margin-top: 50px">
        <?= Breadcrumbs::widget([
            'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
        ]) ?>
        <?= Alert::widget() ?>
        <?= $content ?>
    </div>
</main>

<footer class="footer"  style="bottom: 0;
width: 100%;
text-align: center;
vertical-align: bottom;

position: relative;
z-index: 1;

margin:auto 0;">
    <div class="container">
        <p class="pull-left">Новосибирский Государственный Универститет, <?= date('Y') ?></p>
    </div>
</footer>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
