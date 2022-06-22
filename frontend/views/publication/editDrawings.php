<?php

use common\models\UrlUtils;
use frontend\assets\ViewAsset;
use common\models\Publication;
use yii\helpers\Html;


if(!empty($publication)) {

    $this->title = "Редактирование прорисовок: ".$publication->name;
    $originalImageSrc = "\"" . Publication::getStorageHttpPath().Publication::PREFIX_PATH_IMAGES.'/'.$publication->image . "\"";
    $drawingPathPrefix = "\"" . Publication::getStorageHttpPath(). Publication::PREFIX_PATH_DRAWINGS . '/' . "\"";

    $script = <<< JS
    
    publicationId = $publication->id
    originalImageSrc = $originalImageSrc
    drawingPathPrefix =  $drawingPathPrefix
    drawings = $publication->drawings 
   
    prepareEditablePublication()

JS;

    ViewAsset::register($this);
    $this->registerJs($script, yii\web\View::POS_READY);
} ?>

<h3><?=$this->title?></h3>
<p>

    <?php
    $userRoles = Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());
    if (Yii::$app->user->can('updateOwnPost',
            ['publication' => $publication]) || isset($userRoles['admin'])):?>

        <?= Html::a(Yii::t('app', 'Отмена'),
            ['/publication/view', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'exit-button',
                'style'=>'height:93px;
                padding-top: 27px']) ?>

        <button type="button" class="btn btn-outline-primary btn-rounded" id="save-button">Сохранить <br> изменения</button>

       <!--Html::a(Yii::t('app', 'Загрузить' . '<br>' . ' слои прорисовок'),
            ['/publication/upload-drawings', 'id' => $publication->id],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'upload-drawings-button']); -->

    <?php endif; ?>
<?php
if (strcmp($publication->drawings ,'') != 0
    && sizeof($publication->getDrawings()) > 0
): ?>
        <button type="button" class="btn btn-outline-primary btn-rounded" id="reset-button">Отобразить последние <br> сохраненные настройки слоев</button>
        <?= Html::a(Yii::t('app', 'Перейти ' . '<br>' . ' в графический редактор'),
        ['/publication/create-layer', 'id' => $publication->id],
        ['class' => 'btn btn-outline-primary btn-rounded',
            'name' => 'create-layer-button',]) ?>
</p>

<?php endif; ?>
<form>
    <div class="form-group">
        <label for="name">Название экспоната: </label>
        <input type="text" style="size: auto" class="form-control" id="name" value="<?=$publication->name?>">
    </div>
</form>



<div class="box" style="
    display: flex
">

    <div class="container-publication" data-state="static">
        <div class="canvas-publication">
            <canvas id="publicationCanvas">
            </canvas>
        </div>

         <!--<form style="padding-top: 20px">
                <div class="form-group">
                    <label for="mainDesc">Основное описание:</label>
                    <textarea class="form-control" id="mainDesc" rows="10" ><?/*=$publication->description*/?></textarea>
                </div>
            </form>-->
    </div>


   <!-- --><?php /*if (strcmp($publication->settings ,'') != 0): */?>
            <div id="layers" class = "layers-class" style="padding-left: 20px; ">
                <?=Html::a(Yii::t('app', 'Создать новый слой'),
                    ['/publication/create-layer', 'id' => $publication->id],
                    ['class' => 'btn btn-outline-primary btn-rounded', 'style' => 'margin-bottom: 10px',
                        'name' => 'create-layer-button']);

                if (strcmp($publication->drawings ,'') != 0
                    && sizeof($publication->getDrawings()) > 0
                ): ?>
                    <div id="editForm" style="overflow-y: scroll; height: 700px">
                    </div>
                <?php endif; ?>

            </div>

    <?php /*endif; */?>

</div>

