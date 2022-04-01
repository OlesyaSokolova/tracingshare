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
<h1>Мои публикации</h1>

<?php
 //if (Yii::$app->user->can('createPost')):?>
        <?= Html::a(Yii::t('app', 'Создать новую публикацию'),
            ['/publication/upload'],
            ['class' => 'btn btn-outline-primary btn-rounded',
                'name' => 'upload-button',]) ?>
    <?php //endif; ?>
<br>
<br>

<div id="w0" class="list-view">
    <?php if (!empty($publications)):?>
        <div class="row petroglyphs" style="position: relative;">
            <?php foreach ($publications as $publication): ?>
                <div class="column">
                        <a href="<?= Url::to(['publication/view', 'id' => $publication->id])?>" class="publication-item">

                        <div class="row">
                            <div class="thumbnail" style="background-image: url(<?= Publication::HTTP_PATH_STORAGE . Publication::PREFIX_PATH_THUMBNAILS . '/' . Publication::THUMBNAIL_PREFIX . $publication->image?>)"></div>
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

