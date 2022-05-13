<?php

/* @var $this yii\web\View */

use common\models\Publication;
use yii\bootstrap4\LinkPager;
use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Авторы'; ?>

<h3>Авторы</h3>
<br>
<div>
    <?php if (!empty($authors)):?>
        <div class="btn-group-vertical" ">
            <?php $number = 0;
            foreach ($authors as $author):?>
            <p style="margin-bottom: 10px">

                <?php $number++;
                echo $number.". ";
                $label = $author->last_name
                    . " " . $author->first_name
                    . " " . $author->patronymic
                    . " (" . $author->email . ")";
                echo Html::a(Yii::t('app', $label),
                    Url::to(['/author/publications?id='.$author->id])); ?>
            </p>

                    <!--<a href="<?/*= Url::to(['publication/view', 'id' => $publication->id])*/?>" class="publication-item">

                        <div class="row">
                            <div class="thumbnail" style="background-image: url(<?/*= Publication::getStorageHttpPath() . Publication::PREFIX_PATH_THUMBNAILS . '/' . Publication::THUMBNAIL_PREFIX . $publication->image*/?>)"></div>
                        </div>
                        <h5>
                            <?/*= $publication->name */?>
                        </h5>
                    </a>
                </div>-->
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


