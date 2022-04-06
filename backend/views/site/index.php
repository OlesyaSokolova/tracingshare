<?php

/* @var $this yii\web\View */

use common\models\Publication;
use yii\bootstrap4\LinkPager;
use yii\helpers\Url;

$this->title = 'Управление сайтом'; ?>
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
<h1>Все публикации</h1>
<div id="w0" class="list-view">
    <?php if (!empty($publications)):?>
        <div class="row publications" style="position: relative;">
            <?php foreach ($publications as $publication): ?>
                <div class="column">
                    <a href="<?= Url::to(['publication/view', 'id' => $publication->id])?>" class="publication-item">

                        <div class="row">
                            <div class="thumbnail" style="background-image: url(<?= Publication::getHttpPath() . Publication::PREFIX_PATH_THUMBNAILS . '/' . Publication::THUMBNAIL_PREFIX . $publication->image ?>)"></div>
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

