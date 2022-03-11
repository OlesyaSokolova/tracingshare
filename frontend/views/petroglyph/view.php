<?php

use frontend\assets\ViewAsset;
use common\models\Petroglyph;
use yii\helpers\Html;

if(!empty($petroglyph)) {
    $this->title = $petroglyph->name;
    $originalImageSrc = "\"" . Petroglyph::HTTP_PATH_STORAGE.Petroglyph::PREFIX_PATH_IMAGES.'/'.$petroglyph->image . "\"";
    $drawingPathPrefix = "\"" . Petroglyph::HTTP_PATH_STORAGE . Petroglyph::PREFIX_PATH_DRAWINGS . '/' . "\"";

    $script = <<< JS
    originalImageSrc = $originalImageSrc
    drawingPathPrefix =  $drawingPathPrefix
    settings = $petroglyph->settings   
   
    prepareView()

JS;

    ViewAsset::register($this);
    $this->registerJs($script, yii\web\View::POS_READY);
}
?>

<h2><?=$this->title?></h2>

<?php
if (strcmp($petroglyph->settings ,'') != 0): ?>
<p>
    <button type="button" class="btn btn-outline-primary btn-rounded" id="reset-button">Отобразить авторские настройки</button>
</p>
<?php endif; ?>

    <?php
    if (Yii::$app->user->can('updatePost',
        ['petroglyph' => $petroglyph])):?>

        <?= Html::a(Yii::t('app', 'Редактировать'),
            ['/petroglyph/edit', 'id' => $petroglyph->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'edit-button',]) ?>

        <?= Html::a(Yii::t('app', 'Удалить'),
            ['/petroglyph/delete', 'id' => $petroglyph->id],
            ['class' => 'btn btn-outline-danger btn-rounded',
                'name' => 'delete-button',]) ?>

    <?php endif; ?>
</p>

<div class="box" style="display: flex">
    <div class="container-petroglyph" data-state="static">
        <div class="canvas-petroglyph">
            <canvas id="petroglyphCanvas">
            </canvas>
        </div>
    </div>

    <?php
    //var_dump($petroglyph->settings);
    if (strcmp($petroglyph->settings ,'') != 0): ?>
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

            <div id = "description" >
            </div>
        </div>
    <?php
    else:  ?>
        <p style="margin-left: 30px">
        <?=$petroglyph->description?>
        </p>
    <?php endif; ?>

</div>


<?php
if (strcmp($petroglyph->settings ,'') != 0): ?>

    <p style="margin-top: 20px">
        <?= $petroglyph->description ?>
    </p>
<?php endif; ?>

<!--<p>
    ФИО автора: //$petroglyph->getAuthor()...
</p>-->

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
