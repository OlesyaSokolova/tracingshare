<?php

use backend\assets\ViewAsset;
use common\models\Publication;
use yii\helpers\Html;

if(!empty($publication)) {
    $this->title = $publication->name;
    $originalImageSrc = "\"" . Publication::HTTP_PATH_STORAGE.Publication::PREFIX_PATH_IMAGES.'/'.$publication->image . "\"";
    $drawingPathPrefix = "\"" . Publication::HTTP_PATH_STORAGE . Publication::PREFIX_PATH_DRAWINGS . '/' . "\"";

    $script = <<< JS
    originalImageSrc = $originalImageSrc
    drawingPathPrefix =  $drawingPathPrefix
    settings = $publication->settings   
   
    prepareView()

JS;

    ViewAsset::register($this);
    $this->registerJs($script, yii\web\View::POS_READY);
}
?>

<h2><?=$this->title?></h2>

<?php
if (strcmp($publication->settings ,'') != 0): ?>
<p>
    <button type="button" class="btn btn-outline-primary btn-rounded" id="reset-button">Отобразить авторские настройки</button>
</p>
<?php endif; ?>

    <?php
    $userRoles = Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());

    if (Yii::$app->user->can('updateOwnPost',
        ['publication' => $publication]) || isset($userRoles['admin'])):?>

        <?= Html::a(Yii::t('app', 'Редактировать'),
            ['/publication/edit', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'edit-button',]) ?>

        <?= Html::a(Yii::t('app', 'Удалить'),
            ['/publication/delete', 'id' => $publication->id],
            ['class' => 'btn btn-outline-danger btn-rounded',
                'name' => 'delete-button',]) ?>

    <?php endif; ?>
<br>
<br>

<div class="box" style="display: flex">
    <div class="container-publication" data-state="static">
        <div class="canvas-publication">
            <canvas id="publicationCanvas">
            </canvas>
        </div>
    </div>

    <?php
    //var_dump($publication->settings);
    if (strcmp($publication->settings ,'') != 0): ?>
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
        <?=$publication->description?>
        </p>
    <?php endif; ?>

</div>


<?php
if (strcmp($publication->settings ,'') != 0): ?>

    <p style="margin-top: 20px">
        <?= $publication->description ?>
    </p>
<?php endif; ?>

<!--<p>
    ФИО автора: //$publication->getAuthor()...
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
