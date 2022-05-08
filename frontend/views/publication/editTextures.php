<?php

use frontend\assets\ViewAsset;
use common\models\Publication;
use yii\helpers\Html;

if(!empty($publication)) {

    $this->title = "Текстуры публикации: \"".$publication->name . "\"";
    $texturesPathPrefix = "\"" . Publication::getStorageHttpPath(). Publication::PREFIX_PATH_DRAWINGS . '/' . "\"";

    $script = <<< JS
    
    publicationId = $publication->id
    texturesPathPrefix =  $texturesPathPrefix
    textures = $publication->textures 
   
    prepareEditableTextures()

JS;

    ViewAsset::register($this);
    $this->registerJs($script, yii\web\View::POS_READY);
} ?>

<h3><?=$this->title?></h3>

    <?php
    $userRoles = Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());
    if (Yii::$app->user->can('updateOwnPost',
            ['publication' => $publication]) || isset($userRoles['admin'])):?>
        <button type="button" class="btn btn-outline-primary btn-rounded" id="save-textures-button">Сохранить изменения</button>

        <?= Html::a(Yii::t('app', 'Добавить (загрузить) текстуры'),
            ['/publication/upload-textures', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'upload-textures-button',]) ?>
    <br><br>
    <?php endif; ?>

<div class="d-flex justify-content-center">
        <div id="editTexturesForm">
        </div>
</div>

