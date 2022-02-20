<?php

/** @var yii\web\View $this */
/** @var common\models\User $user */

$verifyLink = Yii::$app->urlManager->createAbsoluteUrl(['site/verify-email', 'token' => $user->verification_token]);
?>
Здравствуйте, <?= $user->first_name." ".$user->patronymic ?>.

Пожалуйста, перейдите по ссылке для подтверждения регистрации:

<?= $verifyLink ?>
