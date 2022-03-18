<?php

use frontend\assets\ViewAsset;
use common\models\Petroglyph;
use yii\helpers\Html;

if(!empty($petroglyph)) {

    $this->title = "Редактирование: ".$petroglyph->name;
    $originalImageSrc = "\"" . Petroglyph::HTTP_PATH_STORAGE.Petroglyph::PREFIX_PATH_IMAGES.'/'.$petroglyph->image . "\"";
    $drawingPathPrefix = "\"" . Petroglyph::HTTP_PATH_STORAGE . Petroglyph::PREFIX_PATH_DRAWINGS . '/' . "\"";

    $script = <<< JS
    
    petroglyphId = $petroglyph->id
    originalImageSrc = $originalImageSrc
    drawingPathPrefix =  $drawingPathPrefix
    settings = $petroglyph->settings
   
    prepareEditablePetroglyph()

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
        <button type="button" class="btn btn-outline-primary btn-rounded" id="save-button">Сохранить</button>
    <?php endif; ?>
</p>
<?php
if ($petroglyph->settings != ''): ?>
    <p>
        <button type="button" class="btn btn-outline-primary btn-rounded" id="reset-button">Отобразить последние сохраненные настройки слоев</button>
    </p>
<?php endif; ?>
<form>
    <div class="form-group">
        <label for="name">Название экспоната: </label>
        <input type="text" style="size: auto" class="form-control" id="name" value="<?=$petroglyph->name?>">
    </div>
</form>



<div class="box" style="
    display: flex
">
    <!--<div class="box" id="instruments">
        //сетка/список с инструментами
    </div>-->

    <div class="container-petroglyph" data-state="static">
        <div class="canvas-petroglyph">
            <canvas id="petroglyphCanvas">
            </canvas>
        </div>

         <form style="padding-top: 20px">
                <div class="form-group">
                    <label for="mainDesc">Основное описание:</label>
                    <textarea class="form-control" id="mainDesc" rows="10" ><?=$petroglyph->description?></textarea>
                </div>
            </form>
    </div>


   <!-- --><?php /*if (strcmp($petroglyph->settings ,'') != 0): */?>
            <div id="layers" class = "layers-class" style="padding-left: 20px;">
                <?= Html::a(Yii::t('app', 'Создать новый слой'),
                    ['/petroglyph/create-layer', 'id' => $petroglyph->id],
                    ['class' => 'btn btn-outline-primary btn-rounded', 'style' => 'margin-bottom: 10px',
                        'name' => 'create-layer-button'],) ?>
            </div>

    <?php /*endif; */?>

</div>

