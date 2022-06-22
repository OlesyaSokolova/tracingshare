<?php

use frontend\assets\ViewAsset;
use common\models\Publication;
use common\models\UrlUtils;
use yii\helpers\Html;


if(!empty($publication)) {

    $this->title = "Рисование: ".$publication->name;
    $originalImageSrc = "\"" . Publication::getStorageHttpPath() .Publication::PREFIX_PATH_IMAGES.'/'.$publication->image . "\"";
    $baseName = explode('.', $publication->image)[0];
    $drawingPrefix =  "\"" . Publication::DRAWING_PREFIX . $baseName . "_" . "\"";
    $drawingPathPrefix = "\"" . Publication::getStorageHttpPath() . Publication::PREFIX_PATH_DRAWINGS . '/' . "\"";
    $currentDrawings = "\"" . $publication->drawings . "\"";
    $texturePathPrefix = "\"" . Publication::getStorageHttpPath() . Publication::PREFIX_PATH_TEXTURES . '/' . "\"";

    if(strcmp($publication->drawings ,'') == 0) {
        $script = "publicationId = $publication->id
        publicationId = $publication->id
        originalImageSrc = $originalImageSrc
        drawingPathPrefix =  $drawingPathPrefix
        texturePathPrefix = $texturePathPrefix
        prefix = $drawingPrefix
        textures = $publication->textures 
        prepareLayersToDraw()";
    }
    else
    {
        $script = "publicationId = $publication->id
        originalImageSrc = $originalImageSrc
        drawingPathPrefix =  $drawingPathPrefix
        texturePathPrefix = $texturePathPrefix
        prefix = $drawingPrefix
        drawings = $publication->drawings
        textures = $publication->textures  
        prepareLayersToDraw()";
    }

    ViewAsset::register($this);
    $this->registerJs($script, yii\web\View::POS_READY);
}
?>

<h3><?=$this->title?>
</h3>
<p>
    <?php $userRoles = Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());
    if (Yii::$app->user->can('updateOwnPost',
            ['publication' => $publication]) || isset($userRoles['admin'])):?>

        <?= Html::a(Yii::t('app', 'Выйти из редактора'),
            ['/publication/view', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'exit-button',]) ?>

        <button type="button" class="btn btn-outline-primary btn-rounded" id="save-layer-button">Сохранить</button>


    <?php endif; ?>
</p>

<div class="d-flex">
    <div class="toolbar">
        <div class="list-group pmd-list pmd-card-list" style="width: 120px; padding-right: 10px">
<!--            <button type="button" class="btn btn-outline-danger btn-rounded" id="delete-layer-button" style="margin-bottom: 10px">Удалить слой</button>
-->            <button type="button" id="delete-layer-button"
                       class="btn btn-outline-danger btn-rounded d-flex list-group-item-action"
                       style="margin-bottom: 10px; padding-left: 30px"
                       data-toggle="tooltip" data-placement="left" title="Удалить слой">
                <!--<span class="media-body">Удалить слой</span>-->
                <img src="<?=UrlUtils::getFirstPartOfUrl()."/frontend/web/icons/delete.png" ?>" width="50"/>
            </button>

<!--            <button type="button" class="btn btn-outline-primary btn-rounded" id="clear-layer-button" style="margin-bottom: 10px">Очистить слой</button>
-->            <button type="button" id="clear-layer-button"
                       class="btn btn-outline-primary btn-rounded d-flex list-group-item-action"
                       style="margin-bottom: 10px; padding-left: 30px"
                       data-toggle="tooltip" data-placement="left" title="Очистить слой">
                <img src="<?=UrlUtils::getFirstPartOfUrl()."/frontend/web/icons/clear.png" ?>" width="50"/>
            </button>

            <button type="button" id="brush-btn"
                    class="btn btn-outline-primary btn-rounded d-flex list-group-item-action"
                    style="margin-bottom: 10px; padding-left: 30px"
                    data-toggle="tooltip" data-placement="left" title="Кисть">
           <!-- <span class="media-body">Кисть</span>-->
                <img src="<?= UrlUtils::getFirstPartOfUrl()."/frontend/web/icons/brush.png" ?>" width="50"/>
            </button>

            <button type="button" id="eraser-btn"
                    class="btn btn-outline-primary btn-rounded d-flex list-group-item-action"
                    style="margin-bottom: 10px; padding-left: 30px"
                    data-toggle="tooltip" data-placement="left" title="Ластик">
            <!-- <span class="media-body">Ластик</span>-->
                <img src="<?=UrlUtils::getFirstPartOfUrl()."/frontend/web/icons/eraser.png" ?>" width="50"/>
            </button>

            <button type="button" id="filler-btn"
                    class="btn btn-outline-primary btn-rounded d-flex list-group-item-action"
                    style="margin-bottom: 10px; padding-left: 30px"
                    data-toggle="tooltip" data-placement="left" title="Заливка">
               <!-- <span class="media-body">Заливка</span>-->
                <img src="<?= UrlUtils::getFirstPartOfUrl()."/frontend/web/icons/fill.png" ?>" width="50"/>
            </button>

            <label for="brushColor" id="change-color-btn">Цвет</label>
            <input type="color" id="brushColor" class ="color-value" value="#000000" name="drawingColor">
            <br>

            <label for="thickness" id="change-thickness-btn" style="margin-right: 10px">Толщина кисти/ластика: </label>
            <img src="<?= UrlUtils::getFirstPartOfUrl()."/frontend/web/icons/line.png" ?>"
                 style="padding-left: 20px"
                 width="100px"
                height="2px"/>
            <br>
            <br>
            <input type=range
                   id="thickness"
                   style="width: 100px; margin-bottom: 10px; transform: rotate(90deg);"
                   class="thickness-value"
                   step='1' min='1' max='10' value='5''">
            <br>
            <br>
            <img src="<?= UrlUtils::getFirstPartOfUrl()."/frontend/web/icons/line.png" ?>"
                 style="padding-left: 20px"
            width="100px"
            height="12px"/>

        </div>
    </div>


    <?php $layersCounter = 0;
   if (strcmp($publication->drawings ,'') != 0
            && sizeof($publication->getDrawings()) > 0) {
        $layersCounter = sizeof($publication->getDrawings());
            }
    $canvasId = "layer_" . "b"  . "_canvas";
    ?>
    <div id="canvases" class="canvasDiv" data-state="static">
        <canvas id="<?= $canvasId ?>" style="border:1px solid black;
            height: fit-content;
            width: max-content;">
        </canvas>
        <?php if (strcmp($publication->drawings ,'') != 0
            && sizeof($publication->getDrawings()) > 0) {
            for($i=0; $i < sizeof($publication->getDrawings()); $i++) {
                //var_dump($publication->getDrawings()[$i]);
                $canvasId = "layer_" . $i . "_canvas";
                //var_dump($i);
                echo '<canvas id="'.$canvasId.'" ></canvas>';
                }
            }
        $canvasId = "layer_" . $layersCounter  . "_canvas";
        ?>
        <canvas id="<?= $canvasId ?>">
        </canvas>
        <div class="form-group">
            <label for="selectTextures">Фоновое изображение:</label>
            <select id="selectTextures" class="form-control"  data-role="select-dropdown" data-profile="minimal">
                <option id="originalImage" value="">Оригинальное изображение</option>
                <option id="none" value="">-</option>
            </select>
        </div>
    </div>

<!--    <div class="overflow-auto">
-->    <div id="layers" class = "layers-class" style="width: fit-content; padding-left: 10px;">
        <button type="button" id="create-layer-button" class="btn btn-outline-primary" style="margin-bottom: 10px">Создать новый слой</button>
        <div id= "thumbnails-layers" class="thumbnails-layers" style="overflow-y: scroll; height: 900px;">

            <?php $idCounter = (sizeof($publication->getDrawings()));?>
    <div id="<?= "thumbnail_div_".$idCounter ?>"style="border:1px solid black;
    border-radius: 10px;
    padding-left: 20px;
    width: 300px;
    height: fit-content;
    text-align: left;
    margin-bottom: 10px;
    background: #d6d5d5">
        <?php $canvasId = "thumbnail_" . $idCounter;
        echo '<label for="'. $canvasId. '">Новый слой '. ($idCounter + 1). ': </label>';
        /*echo '<canvas id="'.$canvasId.'" > </canvas>';*/?>
        <!--<canvas id="newLayerThumbnail">
        </canvas>-->
        <br>
        <?php $alphaId = "alpha_" . $idCounter;
        echo '<label for="'. $alphaId. '">Прозрачность: </label><br>';
        echo '<input type=range name=\"alphaChannel\" class ="alpha-value" id="'.$alphaId.'" step=\'0.02\' min=\'0.02\' max=\'1\' value=\'1\'>' ?>
     </div>

        <div id = "otherLayersThumbnails">
        </div>

        <?php $id = "b";?>
        <div id="<?= "thumbnail_div_".$id ?>" style="border:1px solid black;
        border-radius: 10px;
        padding-left: 5px;
        width: 300px;
        height: fit-content;
        text-align: left;
        margin-bottom: 5px">
            <?php $canvasId = "thumbnail_" . $id;
            echo '<label for="'. $canvasId. '">Фоновое изображение: </label>';
            /*echo '<canvas id="'.$canvasId.'" > </canvas>';*/?>
            <br>
            <?php $alphaId = "alpha_" . $id;
            echo '<label for="'. $alphaId. '">Прозрачность: </label><br>';
            echo '<input type=range name=\"alphaChannel\" class ="alpha-value" id="'.$alphaId.'" step=\'0.02\' min=\'0.02\' max=\'1\' value=\'1\'>' ?>
        </div>
    </div>
  </div>
</div>


