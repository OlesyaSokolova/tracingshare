<?php

use frontend\assets\ViewAsset;
use common\models\Publication;
use yii\helpers\Html;


if(!empty($publication)) {

    $this->title = "Создание нового слоя: ".$publication->name;//TODO: layer name
    $originalImageSrc = "\"" . Publication::getStorageHttpPath() .Publication::PREFIX_PATH_IMAGES.'/'.$publication->image . "\"";
    $baseName = explode('.', $publication->image)[0];
    $drawingPrefix =  "\"" . Publication::DRAWING_PREFIX . $baseName . "_" . "\"";

    $script = <<< JS
    
    publicationId = $publication->id
    originalImageSrc = $originalImageSrc
    prefix = $drawingPrefix
    settings = $publication->settings
   
    prepareLayersToDraw()

JS;

    ViewAsset::register($this);
    $this->registerJs($script, yii\web\View::POS_READY);
} ?>

<h3><?=$this->title?>
</h3>
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
        <input type="text" style="size: auto" class="form-control" id="layerTitle" value="Новый слой">
    </div>
</form>

<!--TODO: add btn to clear canvas
--><!--TODO: add button to create new layer in the editor -->
<div class="d-flex justify-content-around">
    <div class="toolbar">
        <div class="list-group pmd-list pmd-card-list" style="width: fit-content; padding-right: 10px">
            <button type="button" class="btn btn-outline-primary btn-rounded" id="clear-layer-button" style="margin-bottom: 10px">Очистить слой</button>

            <button type="button" id="brush-btn" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
            <span class="media-body">Кисть</span>
            <img id="brush-icn" src="http://localhost/tracingshare/icons/brush.png" width="50"/>
            </button>

            <button type="button" id="eraser-btn" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
             <span class="media-body">Ластик</span>
                <img src="http://localhost/tracingshare/icons/eraser.png" width="50"/>
            </button>

            <button type="button" id="filler-btn" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
                <span class="media-body">Заливка</span>
                <img src="http://localhost/tracingshare/icons/fill.png" width="50"/>
            </button>

            <label for="brushColor" id="change-color-btn">Цвет</label>
            <input type="color" id="brushColor" class ="color-value" value="#000000" name="drawingColor">

            <label for="thickness" id="change-thickness-btn">Толщина кисти/ластика: </label>
            <input type=range id="thickness" style="width: 300px" class="thickness-value" step='1' min='1' max='10' value='5' >

        </div>
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

    <div id="layers" class = "layers-class" style="width: fit-content; padding-left: 10px">
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
                <input type=range name="alphaChannel" class ="orgnl-img-alpha-value" id="originalImageThumbnailAlpha" step='0.02' min='0' max='1' value='1' oninput=\"this.nextElementSibling.value = this.value\">
            </div>

        </div>
    </div>
</div>

<form style="padding-top: 20px">
    <div class="form-group">
        <label for="layerDesc">Описание:</label>
        <textarea class="form-control" id="layerDesc" rows="10" >Описание</textarea>
    </div>
</form>

