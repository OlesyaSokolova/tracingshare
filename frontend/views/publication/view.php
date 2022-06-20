<?php

use frontend\assets\ViewAsset;
use common\models\Publication;
use yii\helpers\Html;

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
    <?php $userRoles = Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());
    if (Yii::$app->user->can('updateOwnPost',
        ['publication' => $publication]) || isset($userRoles['admin'])):?>

        <?= Html::a(Yii::t('app', 'Удалить' . '<br>' . 'публикацию'),
            ['/publication/delete', 'id' => $publication->id],
            ['class' => 'btn btn-outline-danger btn-rounded',
                'name' => 'delete-button',]) ?>

        <?= Html::a(Yii::t('app', 'Загрузить слои ' . '<br>' . 'прорисовок'),
            ['/publication/upload-drawings', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'upload-drawings-button',]) ?>

        <?= Html::a(Yii::t('app', 'Загрузить ' . '<br>' . 'текстуры'),
            ['/publication/upload-textures', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'upload-textures-button',]) ?>

        <?php if (strcmp($publication->textures ,'') != 0
        && sizeof($publication->getTextures()) > 0): ?>
        <?= Html::a(Yii::t('app', 'Редактировать ' . '<br>' . 'текстуры'),
            ['/publication/edit-textures', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'edit-textures-button',]) ?>
        <?php endif; ?>

        <?php if (strcmp($publication->drawings ,'') != 0
            && sizeof($publication->getDrawings()) > 0): ?>
        <?= Html::a(Yii::t('app', 'Редактировать демонстрационные' . '<br>' . 'настройки'),
            ['/publication/edit', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'edit-button',]) ?>
        <?php endif; ?>

        <?= Html::a(Yii::t('app', 'Перейти в графический ' . '<br>' . 'редактор слоев'),
            ['/publication/create-layer', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'create-layer-button',]) ?>
        <br>
        <br>
    <?php
    else:
        echo '<br>';
    endif; ?>

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
                border-radius: 10px;
                width: 700px;
                padding-bottom: 20px;
                height: fit-content;
                text-align: center;
                margin-bottom: 10px">

            <h5 id ="layer_title"> </h5>

            <div id = "description" sty>
            </div>
        </div>
    <?php
    else:  ?>
        <p style="margin-left: 30px; ">
        <?= $publication->description?>
        </p>
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

<!--<div id="rt_popover" style="width: 200px"><div id="rt_popover">1 : <input type='range' id='0' class='alpha-value' step='0.05' min='-1' max='1' value='0.5'><button value="0" class="btn menu-object cp-button" data-menu="layer_pallete" data-html="true" data-container="#rt_popover"data-toggle="popover" data-placement="bottom"><i class="fas fa-palette"></i></button><br>2 : <input type='range' id='1' class='alpha-value' step='0.05' min='-1' max='1' value='0.6'><button value="1" class="btn menu-object cp-button" data-menu="layer_pallete" data-html="true" data-container="#rt_popover"data-toggle="popover" data-placement="bottom"><i class="fas fa-palette"></i></button><br>3 : <input type='range' id='2' class='alpha-value' step='0.05' min='-1' max='1' value='0.8656377'><button value="2" class="btn menu-object cp-button" data-menu="layer_pallete" data-html="true" data-container="#rt_popover"data-toggle="popover" data-placement="bottom"><i class="fas fa-palette"></i></button><br></div></div>
--><?php /*if ($categoryId): */?><!--
    <div class="clearfix">
        <?php /*if ($objectPrev): */?>
            <?php /*= Html::a('<i class="fas fa-backward"></i> ' . $objectPrev->name, ['/object/view', 'categoryId' => $categoryId, 'id' => $objectPrev->link], ['class' => 'pull-left btn btn-default']) */?>
        <?php /*endif; */?>
        <?php /*if ($objectNext): */?>
            <?php /*= Html::a($objectNext->name . ' <i class="fas fa-forward"></i>', ['/object/view', 'categoryId' => $categoryId, 'id' => $objectNext->link], ['class' => 'pull-right btn btn-default']) */?>
        <?php /*endif; */?>
    </div>
--><?php /*endif; */?>
