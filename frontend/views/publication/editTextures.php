<?php

use frontend\assets\ViewAsset;
use common\models\Publication;
use yii\helpers\Html;

if(!empty($publication)) {

    $this->title = "Редактирование текстур: \"".$publication->name . "\"";
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
    if (Yii::$app->user->can('updatePost',
            ['publication' => $publication])):?>

        <?= Html::a(Yii::t('app', 'Отмена'),
            ['/publication/view', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'exit-button',]) ?>

        <button type="button" class="btn btn-outline-primary btn-rounded" id="save-textures-button">Сохранить изменения</button>

       <!-- Html::a(Yii::t('app', 'Добавить (загрузить) текстуры'),
            ['/publication/upload-textures', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'upload-textures-button',])-->
    <br><br>
    <?php endif; ?>

<div class="d-flex justify-content-center" id="resultMessage" style="color: grey"></div>
<br>
<div class="d-flex justify-content-center">
        <div id="editTexturesForm">
        </div>
</div>

