<?php

/* @var $this yii\web\View */

use common\models\Publication;
use yii\bootstrap4\LinkPager;
use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Публикации'; ?>


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
<?php if (!empty($author)):?>
<h3><?= $author->last_name
                    . " " . $author->first_name
                    . " " . $author->patronymic
                    . " (" . $author->email . ")"?>
</h3>
<?php endif;
if (empty($publications)):?>
    <h5>Публикаций нет.</h5>
<?php endif; ?>

<div id="w0" class="list-view">
    <?php if (!empty($publications)):?>
         <h5 style="margin-bottom: 30px">Количество публикаций: <?= sizeof($publications)?></h5>
        <div class="row petroglyphs" style="position: relative;">
            <?php foreach ($publications as $publication): ?>
                <div class="column">
                    <a href="<?= Url::to(['publication/view', 'id' => $publication->id])?>" class="publication-item">

                        <div class="row">
                            <div class="thumbnail" style="background-image: url(<?= Publication::getStorageHttpPath() . Publication::PREFIX_PATH_THUMBNAILS . '/' . Publication::THUMBNAIL_PREFIX . $publication->image?>)"></div>
                        </div>
                        <h5>
                            <?= $publication->name ?>
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

