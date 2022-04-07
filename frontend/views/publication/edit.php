<?php

use frontend\assets\ViewAsset;
use common\models\Publication;
use yii\helpers\Html;

if(!empty($publication)) {

    $this->title = "Редактирование: ".$publication->name;
    $originalImageSrc = "\"" . Publication::getStorageHttpPath().Publication::PREFIX_PATH_IMAGES.'/'.$publication->image . "\"";
    $drawingPathPrefix = "\"" . Publication::getStorageHttpPath(). Publication::PREFIX_PATH_DRAWINGS . '/' . "\"";

    $script = <<< JS
    
    publicationId = $publication->id
    originalImageSrc = $originalImageSrc
    drawingPathPrefix =  $drawingPathPrefix
    settings = $publication->settings
   
    prepareEditablePublication()

JS;

    ViewAsset::register($this);
    $this->registerJs($script, yii\web\View::POS_READY);
} ?>

<h2><?=$this->title?>
</h2>
<p>

    <?php
    $userRoles = Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());
    if (Yii::$app->user->can('updateOwnPost',
            ['publication' => $publication]) || isset($userRoles['admin'])):?>
        <button type="button" class="btn btn-outline-primary btn-rounded" id="save-button">Сохранить</button>

        <?= Html::a(Yii::t('app', 'Загрузить слои прорисовок'),
            ['/publication/upload-drawings', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'upload-drawings-button',]) ?>

    <?php endif; ?>
</p>
<?php
if ($publication->settings != ''): ?>
    <p>
        <button type="button" class="btn btn-outline-primary btn-rounded" id="reset-button">Отобразить последние сохраненные настройки слоев</button>
    </p>
<?php endif; ?>
<form>
    <div class="form-group">
        <label for="name">Название экспоната: </label>
        <input type="text" style="size: auto" class="form-control" id="name" value="<?=$publication->name?>">
    </div>
</form>



<div class="box" style="
    display: flex
">

    <div class="container-publication" data-state="static">
        <div class="canvas-publication">
            <canvas id="publicationCanvas">
            </canvas>
        </div>

         <form style="padding-top: 20px">
                <div class="form-group">
                    <label for="mainDesc">Основное описание:</label>
                    <textarea class="form-control" id="mainDesc" rows="10" ><?=$publication->description?></textarea>
                </div>
            </form>
    </div>


   <!-- --><?php /*if (strcmp($publication->settings ,'') != 0): */?>
            <div id="layers" class = "layers-class" style="padding-left: 20px;">
                <?= Html::a(Yii::t('app', 'Создать новый слой'),
                    ['/publication/create-layer', 'id' => $publication->id],
                    ['class' => 'btn btn-outline-primary btn-rounded', 'style' => 'margin-bottom: 10px',
                        'name' => 'create-layer-button'],) ?>
                <div id="editForm"">
                    <div>
            </div>

    <?php /*endif; */?>

</div>

