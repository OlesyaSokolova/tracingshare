<?php

use frontend\assets\ViewAsset;
use common\models\Petroglyph;
use yii\helpers\Html;

if(!empty($petroglyph)) {

    $this->title = "Создание нового слоя: ".$petroglyph->name;//TODO: layer name
    $originalImageSrc = "\"" . Petroglyph::HTTP_PATH_STORAGE.Petroglyph::PREFIX_PATH_IMAGES.'/'.$petroglyph->image . "\"";
    $drawingPathPrefix = "\"" . Petroglyph::HTTP_PATH_STORAGE . Petroglyph::PREFIX_PATH_DRAWINGS . '/' . "\"";

    $script = <<< JS
    
    petroglyphId = $petroglyph->id
    originalImageSrc = $originalImageSrc
    drawingPathPrefix =  $drawingPathPrefix
    settings = $petroglyph->settings
   
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
            ['petroglyph' => $petroglyph]) || isset($userRoles['admin'])):?>
        <button type="button" class="btn btn-outline-primary btn-rounded" id="save-layer-button">Сохранить</button>
    <?php endif; ?>
</p>

<form>
    <div class="form-group">
        <label for="title">Название слоя: </label>
        <input type="text" style="size: auto" class="form-control" id="title" value="<?=$petroglyph->name?>">
    </div>
</form>



<div class="d-flex justify-content-around">

    <!-- List With Icons -->
    <div class="list-group pmd-list pmd-card-list">
        <button type="button" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
            <span class="media-body">Кисть</span>
        </button>

        <button type="button" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
            <span class="media-body">Ластик</span>
        </button>

        <button type="button" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
            <span class="media-body">Заливка</span>
        </button>

        <button type="button" class="btn btn-outline-primary btn-rounded d-flex list-group-item-action" style="margin-bottom: 10px">
            <span class="media-body">Прозрачность</span>
        </button>

        <label for="brushColor">Цвет</label>
        <input type="color" id="brushColor" class =\'color-value\' value="#000000" name="drawingColor">

        <label for="thickness">Толщина кисти/ластика: </label>
        <input type=range id="thickness" class=\'alpha-value\' step=\'0.02\' min=\'0\' max=\'1\' value=1 oninput=\"this.nextElementSibling.value = this.value\">

    </div>


    <div class="container-layer" data-state="static">
        <div class="canvas-layer">
            <canvas id="layerCanvas">
            </canvas>
        </div>
    </div>

    <div id="layers" class = "layers-class" style="width: 300px;">
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
                <input type=range name="alphaChannel" id="newLayerThumbnailAlpha" class=\'alpha-value\' step=\'0.02\' min=\'0\' max=\'1\' value=1 oninput=\"this.nextElementSibling.value = this.value\">
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
                <input type=range name="alphaChannel" id="originalImageThumbnailAlpha" class=\'alpha-value\' step=\'0.02\' min=\'0\' max=\'1\' value=1 oninput=\"this.nextElementSibling.value = this.value\">
            </div>

        </div>
    </div>
</div>

<form style="padding-top: 20px">
    <div class="form-group">
        <label for="layerDesc">Описание:</label>
        <textarea class="form-control" id="layerDesc" rows="10" ><?=$petroglyph->description?></textarea>
    </div>
</form>

