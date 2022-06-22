<?php

use frontend\assets\ViewAsset;
use common\models\Publication;
use yii\bootstrap4\Dropdown;
use yii\helpers\Html;
use yii\helpers\Url;

if(!empty($publication)) {

    $this->title = $publication->name;
    $originalImageSrc = "\"" . Publication::getStorageHttpPath().Publication::PREFIX_PATH_IMAGES.'/'.$publication->image . "\"";
    $drawingPathPrefix = "\"" . Publication::getStorageHttpPath() . Publication::PREFIX_PATH_DRAWINGS . '/' . "\"";
    $texturePathPrefix = "\"" . Publication::getStorageHttpPath() . Publication::PREFIX_PATH_TEXTURES . '/' . "\"";
    //$settings = json_encode(array("drawings"=>$publication->drawings, "textures"=>$publication->textures));

    if(strcmp($publication->drawings ,'') == 0) {
        $script = "originalImageSrc = $originalImageSrc
        drawingPathPrefix =  $drawingPathPrefix
        texturePathPrefix = $texturePathPrefix
        textures = $publication->textures 
        prepareView()";
    }
    else
    {
        $script = "originalImageSrc = $originalImageSrc
        drawingPathPrefix =  $drawingPathPrefix
        texturePathPrefix = $texturePathPrefix
        drawings = $publication->drawings
        textures = $publication->textures  
        prepareView()";
    }

    ViewAsset::register($this);
    $this->registerJs($script, yii\web\View::POS_READY);
}
?>
<h3><?=$this->title?></h3>

<p>
    <?php
    if (strcmp($publication->drawings ,'') != 0
        && sizeof($publication->getDrawings()) > 0): ?>
    <button type="button" class="btn btn-outline-primary btn-rounded" id="reset-button">Отобразить авторские настройки</button>
    <?php endif; ?>
    <button type="button" class="btn btn-outline-primary btn-rounded" id="download-zip-button">Скачать (.zip)</button>
    <?php echo Html::a(Yii::t('app', 'Скачать (.tiff)'),
        ['/publication/download-tiff', 'id' => $publication->id],
        ['class' => 'btn btn-outline-primary btn-rounded',
            'name' => 'download-tiff-button',]); ?>
<!--    <button type="button" class="btn btn-outline-primary btn-rounded" id="download-button">Скачать (.zip)</button>
-->
</p>
    <?php  $userRoles = Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());
    if (Yii::$app->user->can('updateOwnPost',
            ['publication' => $publication]) || isset($userRoles['admin'])):

        echo Html::a(Yii::t('app', 'Удалить' . '<br>' .'публикацию'),
        ['/publication/delete', 'id' => $publication->id],
        ['class' => 'btn btn-outline-danger btn-rounded',
        'name' => 'create-layer-button',]) ?>

        <div class="dropdown" style="display: inline-block">
                <a style="margin-right: 1px" class="btn btn-outline-primary btn-rounded dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Редактировать<br>прорисовки
                </a>
                <?php
                $items = [];
                $items[] = ['label' => 'Загрузить новые', 'url' => Url::to(['/publication/upload-drawings?id='.$publication->id])];

                if (strcmp($publication->drawings ,'') != 0
                    && sizeof($publication->getDrawings()) > 0):
                    $items[] = ['label' => 'Изменить существующие', 'url' => Url::to(['/publication/edit-drawings?id='.$publication->id])];
/*                    $items[] = ['label' => 'Редактировать демонстрационные настройки', 'url' => Url::to(['/publication/edit?id='.$publication->id])];*/
                endif;
                $items[] = ['label' => 'Перейти в графический редактор', 'url' => Url::to(['/publication/draw?id='.$publication->id.'&newLayer=1'])];
                echo Dropdown::widget([
                    'items' => $items
                ]);
                ?>
        </div>

        <div class="dropdown" style="display: inline-block">
                <a class="btn btn-outline-primary btn-rounded dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Редактировать<br>текстуры
                </a>
                <?php
                $items = [];
                $items[] = ['label' => 'Загрузить новые', 'url' => Url::to(['/publication/upload-textures?id='.$publication->id])];

                if (strcmp($publication->textures ,'') != 0
                    && sizeof($publication->getTextures()) > 0):
                    $items[] = ['label' => 'Изменить существующие', 'url' => Url::to(['/publication/edit-textures?id='.$publication->id])];
                endif;
                echo Dropdown::widget([
                    'items' => $items
                ]);
                ?>
        </div>

        <?= Html::a(Yii::t('app', 'Редактировать' . '<br>' .'основную информацию'),
            ['/publication/edit', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded']) ?>
        <?php endif; ?>

        <br>
        <br>
<div class="box" style="display: flex">
    <div class="container-publication" data-state="static">
        <div class="canvas-publication">
            <canvas id="publicationCanvas">
            </canvas>
        </div>

        <?php
        /*if ((strcmp($publication->textures ,'') != 0)
            && sizeof($publication->getTextures()) > 0): */?>

            <div class="form-group">
                <label for="selectTextures">Фоновое изображение:</label>
                <select id="selectTextures" class="form-control" data-role="select-dropdown" data-profile="minimal">
                    <option id="originalImage" value="">Оригинальное изображение</option>
                    <option id="none" value="">-</option>
                </select>
            </div>
        <div id="backgroundDescription"></div>
       <!-- --><?php /*endif; */?>
    </div>

    <?php
    if (strcmp($publication->drawings ,'') != 0
        && sizeof($publication->getDrawings()) > 0
        ): ?>
        <div style="padding-left: 20px; margin-right: 20px" id="layers" class = "layers-class">
        </div>

        <div id=layer_info style="border:1px solid black;
            display: inline-block;
                border-radius: 10px;
                width: 700px;
                padding-bottom: 20px;
                height: fit-content;
                text-align: center;
                margin-bottom: 10px">

            <h5 id ="layer_title"> </h5>

            <div id = "description">
            </div>
        </div>
    <?php
    else:  ?>
        <div style="margin-left: 30px; display: inline-block ">
        <?= $publication->description?>
        </div>
    <?php endif; ?>

</div>
<?php
if ((strcmp($publication->drawings ,'') != 0)
    && sizeof($publication->getDrawings()) > 0): ?>

    <p style="margin-top: 10px; display: flex; word-break: break-word">
        <?= $publication->description ?>
    </p>
<?php endif; ?>

<p>
    Автор:  <?= $publication->getAuthorName() ?>
</p>
