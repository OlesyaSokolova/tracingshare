<?php

use frontend\assets\ViewAsset;
use common\models\Publication;
use yii\helpers\Html;

if(!empty($publication)) {

    $this->title = "Создание нового слоя: ".$publication->name;//TODO: layer name
    $originalImageSrc = "\"" . Publication::HTTP_PATH_STORAGE.Publication::PREFIX_PATH_IMAGES.'/'.$publication->image . "\"";
    $drawingPathPrefix = "\"" . Publication::HTTP_PATH_STORAGE . Publication::PREFIX_PATH_DRAWINGS . '/' . "\"";

    $script = <<< JS
    
    publicationId = $publication->id
    originalImageSrc = $originalImageSrc
    drawingPathPrefix =  $drawingPathPrefix
    settings = $publication->settings
   
    prepareLayersToDraw()

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
        <button type="button" class="btn btn-outline-primary btn-rounded" id="save-layer-button">Сохранить</button>
    <?php endif; ?>
</p>

<form>
    <div class="form-group">
        <label for="title">Название слоя: </label>
        <input type="text" style="size: auto" class="form-control" id="title" value="<?=$publication->name?>">
    </div>
</form>

<!--TODO: add btn to clear canvas
--><!--TODO: add button to create new layer in the editor
 if user creates new layer from editor, settings should be updated -->
<div class="d-flex justify-content-around">

    <!-- List With Icons -->
    <div class="list-group pmd-list pmd-card-list" id="toolbar" style="width: fit-content; padding-right: 10px">
        <button type="button" id="brush" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
            <span class="media-body">Кисть</span>
            <img src="http://localhost/tracingshare/icons/brush.png" width="50"/>

        </button>

        <button type="button" id="eraser" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
         <span class="media-body">Ластик</span>
            <img src="http://localhost/tracingshare/icons/eraser.png" width="50"/>
        </button>

        <button type="button" id="fill" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
            <span class="media-body">Заливка</span>
            <img src="http://localhost/tracingshare/icons/fill.png" width="50"/>
        </button>

        <label for="brushColor" id="change-color-btn">Цвет</label>
        <input type="color" id="brushColor" class =\'color-value\' value="#000000" name="drawingColor">

        <label for="thickness" id="change-thickness-btn">Толщина кисти/ластика: </label>
        <input type=range id="thickness" style="width: 300px" class=\'alpha-value\' step='0.02' min='0' max='1' value='1' oninput=\"this.nextElementSibling.value = this.value\">

    </div>


    <div class="canvasDiv" data-state="static" style="border:1px solid black;
            border-radius: 10px;
            width: max-content;
            padding: 30px">
        <canvas id="background">
        </canvas>
        <canvas id="layerToDrawOn">
        </canvas>
    </div>

    <div id="layers" class = "layers-class"style="width: fit-content; padding-left: 10px">
        <div class="thumbnails-layers">

            <div style="border:1px solid black;
            border-radius: 10px;
            padding-left: 20px;
            width: 400px;
            text-align: left;
            margin-bottom: 10px">
                <label for="newLayerThumbnail">Новый слой: </label>
                <canvas id="newLayerThumbnail">
                </canvas>
                <br>
                <label for="newLayerThumbnailAlpha">Прозрачность: </label>
                <input type=range name="alphaChannel" id="newLayerThumbnailAlpha" class=\'alpha-value\' step='0.02' min='0' max='1' value='1' oninput=\"this.nextElementSibling.value = this.value\">
            </div>

            <div style="border:1px solid black;
                border-radius: 10px;
                padding-left: 20px;
                width: 400px;
                text-align: left;
                margin-bottom: 10px" id = "otherLayersThumbnails">
            </div>

            <div style="border:1px solid black;
            border-radius: 10px;
            padding-left: 20px;
            width: 400px;
            text-align: left;
            margin-bottom: 10px">
                <label for="originalImageThumbnail">Оригинальное изображение: </label>
                <canvas id="originalImageThumbnail">
                </canvas>
                <br>
                <label for="originalImageThumbnailAlpha">Прозрачность: </label>
                <input type=range name="alphaChannel" id="originalImageThumbnailAlpha" class=\'alpha-value\' step='0.02' min='0' max='1' value='1' oninput=\"this.nextElementSibling.value = this.value\">
            </div>

        </div>
    </div>
</div>

<!--<form style="padding-top: 20px">
    <div class="form-group">
        <label for="layerDesc">Описание:</label>
        <textarea class="form-control" id="layerDesc" rows="10" ><?/*=$publication->description*/?></textarea>
    </div>
</form>-->

