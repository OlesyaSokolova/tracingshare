<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model common\models\User */
/* @var $form yii\widgets\ActiveForm */
?>

<?php $form = ActiveForm::begin(); ?>
    <div class="row">
        <div class="col-xs-12 col-md-6">
<!--            --><?//= $form->field($model, 'status')->checkbox(['checked' => ($model->status != null)]) ?>
            <?= $form->field($model, 'first_name')->textInput(['autofocus' => true]) ?>
            <?= $form->field($model, 'last_name')->textInput() ?>
            <?= $form->field($model, 'patronymic')->textInput() ?>
            <?= $form->field($model, 'email')->textInput(['autofocus' => true]) ?>
<!--            TODO: write password to an empty field -->
           <!-- --><?/*= $form->field($model, 'password')->passwordInput() */?>
           <!-- <?/*= $form->field($model, 'roles')->checkboxList($roles) */?>
            --><?/*= $form->field($model, 'permissions')->checkboxList($permissions) */?>
        </div>
        <div class="col-xs-12 col-md-6 text-right">
            <div class="form-group">
                <?= Html::submitButton('Сохранить', ['class' => 'btn btn-primary']) ?>
            </div>
        </div>
    </div>
<?php ActiveForm::end(); ?>
