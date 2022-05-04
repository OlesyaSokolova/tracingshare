<?php

use frontend\assets\ViewAsset;
use common\models\Publication;
use yii\helpers\Html;


if(!empty($publication)) {

    $this->title = "Рисование: ".$publication->name;//TODO: layer name
    $originalImageSrc = "\"" . Publication::getStorageHttpPath() .Publication::PREFIX_PATH_IMAGES.'/'.$publication->image . "\"";
    $baseName = explode('.', $publication->image)[0];
    $drawingPrefix =  "\"" . Publication::DRAWING_PREFIX . $baseName . "_" . "\"";
    $drawingPathPrefix = "\"" . Publication::getStorageHttpPath() . Publication::PREFIX_PATH_DRAWINGS . '/' . "\"";
    $currentSettings = "\"" . $publication->settings . "\"";
    $script = <<< JS
    
    publicationId = $publication->id
    originalImageSrc = $originalImageSrc
    prefix = $drawingPrefix
    drawingPathPrefix =  $drawingPathPrefix
    settings = $publication->settings
    
    prepareLayersToDraw()

JS;

    ViewAsset::register($this);
    $this->registerJs($script, yii\web\View::POS_READY);
} ?>

<h3><?=$this->title?>
</h3>
<p class="d-flex justify-content-left">
    <?php
    $userRoles = Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());
    if (Yii::$app->user->can('updateOwnPost',
            ['publication' => $publication]) || isset($userRoles['admin'])):?>
        <button type="button" class="btn btn-outline-primary btn-rounded" id="save-layer-button">Сохранить</button>
    <?php endif; ?>
</p>

<!--<form>
    <div class="form-group">
        <label for="title">Название слоя: </label>
        <input type="text" style="size: auto" class="form-control" id="layerTitle" value="Новый слой">
    </div>
</form>-->

<!--TODO: add button to create new layer in the editor -->
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


    <?php $layersCounter = 0;
   if (strcmp($publication->settings ,'') != 0
            && sizeof($publication->getDrawings()) > 0) {
        $layersCounter = sizeof($publication->getDrawings());
            }
    $canvasId = "layer_" . "b"  . "_canvas";
    ?>
    <div id="canvases" class="canvasDiv" data-state="static" style="border:1px solid black;
            border-radius: 10px;
            height: fit-content;
            width: max-content;">
        <canvas id="<?= $canvasId ?>">
        </canvas>
        <?php if (strcmp($publication->settings ,'') != 0
            && sizeof($publication->getDrawings()) > 0) {
            for($i=0; $i < sizeof($publication->getDrawings()); $i++) {
                $canvasId = "layer_" . $i . "_canvas";
                echo '<canvas id="'.$canvasId.'" ></canvas>';
                }
            }
        $canvasId = "layer_" . $layersCounter  . "_canvas";
        ?>
        <canvas id="<?= $canvasId ?>">
        </canvas>
    </div>

<!--    <div class="overflow-auto">
-->    <div id="layers" class = "layers-class" style="width: fit-content; padding-left: 10px;">
        <button type="button" id="create-layer-button" class="btn btn-outline-primary" style="margin-bottom: 10px">Создать новый слой</button>
        <div id= "thumbnails-layers" class="thumbnails-layers" style="overflow-y: scroll; height: 1500px">

            <?php $idCounter = (sizeof($publication->getDrawings()));?>
            <div id="<?= "thumbnail_div_".$idCounter ?>"style="border:1px solid black;
            border-radius: 10px;
            padding-left: 20px;
            width: 400px;
            height: 200px;
            text-align: left;
            margin-bottom: 10px;
            background: #d6d5d5">
                <?php $canvasId = "thumbnail_" . $idCounter;
                echo '<label for="'. $canvasId. '">Новый слой: </label>';
                echo '<canvas id="'.$canvasId.'" > </canvas>';?>
                <!--<canvas id="newLayerThumbnail">
                </canvas>-->
                <br>
                <?php $alphaId = "alpha_" . $idCounter;
                echo '<label for="'. $alphaId. '">Прозрачность: </label>';
                echo '<input type=range name=\"alphaChannel\" class ="alpha-value" id="'.$alphaId.'" step=\'0.02\' min=\'0.02\' max=\'1\' value=\'1\'>' ?>
<!--                <input type=range name="alphaChannel" class ="new-layer-alpha-value" id="'.$alphaId.'" step='0.02' min='0.02' max='1' value='1'>
-->         </div>

          <!--  <div style="border:1px solid black;
                border-radius: 10px;
                padding-left: 20px;
                width: 400px;
                text-align: left;
                margin-bottom: 10px"-->
                 <div id = "otherLayersThumbnails">
                </div>

            <?php $id = "b";?>
            <div id="<?= "thumbnail_div_".$id ?>" style="border:1px solid black;
            border-radius: 10px;
            padding-left: 20px;
            width: 400px;
            height: 250px;
            text-align: left;
            margin-bottom: 10px">
                <?php $canvasId = "thumbnail_" . $id;
                echo '<label for="'. $canvasId. '">Фоновое изображение: </label>';
                echo '<canvas id="'.$canvasId.'" > </canvas>';?>
                <!--<canvas id="newLayerThumbnail">
                </canvas>-->
                <br>
                <?php $alphaId = "alpha_" . $id;
                echo '<label for="'. $alphaId. '">Прозрачность: </label>';
                echo '<input type=range name=\"alphaChannel\" class ="alpha-value" id="'.$alphaId.'" step=\'0.02\' min=\'0.02\' max=\'1\' value=\'1\'>' ?>
                <!--                <input type=range name="alphaChannel" class ="new-layer-alpha-value" id="'.$alphaId.'" step='0.02' min='0.02' max='1' value='1'>
                -->
            </div>
        </div>
<!--    </div>
-->    </div>
</div>

<!--<form style="padding-top: 20px">
    <div class="form-group">
        <label for="layerDesc">Описание:</label>
        <textarea class="form-control" id="layerDesc" rows="10" >Описание</textarea>
    </div>
</form>-->

