<?php

/** @var yii\web\View $this */
/** @var common\models\User $user */

$resetLink = Yii::$app->urlManager->createAbsoluteUrl(['site/reset-password', 'token' => $user->password_reset_token]);
?>
Здравствуйте, <?= $user->first_name." ".$user->patronymic ?>.

Перейдите по ссылке для сброса пароля:

<?= $resetLink ?>
