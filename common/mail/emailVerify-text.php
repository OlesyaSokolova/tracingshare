<?php

/** @var yii\web\View $this */
/** @var common\models\User $user */

$verifyLink = Yii::$app->urlManager->createAbsoluteUrl(['site/verify-email', 'token' => $user->verification_token]);
?>
Hello <?= $user->first_name." ".$user->patronymic ?>,

пожалуйста, перейдите по ссылке для подтверждения регистрации:

<?= $verifyLink ?>
