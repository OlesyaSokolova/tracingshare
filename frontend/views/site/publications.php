<?php

/* @var $this yii\web\View */

use app\models\Petroglyph;
use yii\bootstrap4\LinkPager;
use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Публикации';


?>
<style>
    .thumbnail {
        background-color: white;
        width: 300px;
        height: 300px;
        object-fit: contain;
        display: inline-block; /* makes it fit in like an <img> */
        background-size: contain; /* or contain */
        background-position: center center;
        background-repeat: no-repeat;
    }
</style>
<h1>Мои публикации</h1>
<div id="w0" class="list-view">
    <?php if (!empty($petroglyphs)):?>
        <div class="row petroglyphs" style="position: relative;">
            <?php foreach ($petroglyphs as $petroglyph): ?>
                <div class="column">
                        <a href="<?= Url::to(['petroglyph/view', 'id' => $petroglyph->id])?>" class="petroglyph-item">

                        <div class="row">
                            <div class="thumbnail" style="background-image: url(<?= Petroglyph::PATH_STORAGE.Petroglyph::PATH_IMAGES.'/'.$petroglyph->image ?>)"></div>
                        </div>
                        <h5>
                            <?= $petroglyph->name ?>
                        </h5>
                    </a>
                </div>
            <?php endforeach;
            ?>
        </div>
    <?php endif; ?>
</div>
<?php
if(!empty($pages)):
    echo LinkPager::widget([
        'pagination' => $pages,
    ]); ?>
<?php endif;
?>

