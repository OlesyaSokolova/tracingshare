<?php

namespace frontend\models;

use Yii;
use yii\base\Model;
use common\models\User;

/**
 * Signup form
 */
class SignupForm extends Model
{
    public $first_name;
    public $last_name;
    public $patronymic;
    public $email;
    public $password;


    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['first_name', 'last_name', 'patronymic'], 'required', 'message' => 'Это поле не может быть пустым'],
            [['first_name', 'last_name', 'patronymic'], 'string', 'min' => 2, 'max' => 32, 'message' => 'Максимальная длина: 32 символа'],

            ['email', 'trim'],
            ['email', 'required'],
            ['email', 'email', 'message' => 'Неправильный формат email.'],
            ['email', 'string', 'max' => 32, 'message' => 'Максимальная длина: 32 символа'],
            ['email', 'unique', 'targetClass' => '\common\models\User', 'message' => 'Пользователь с таким email уже существует.'],

            ['password', 'required'],
            ['password', 'string', 'min' => Yii::$app->params['user.passwordMinLength']],
        ];
    }

    /**
     * Signs user up.
     *
     * @return bool whether the creating new account was successful and email was sent
     */
    public function signup()
    {
        if (!$this->validate()) {
            return null;
        }

        $user = new User();
        $user->first_name = $this->first_name;
        $user->last_name = $this->last_name;
        $user->patronymic = $this->patronymic;
        $user->email = $this->email;
        $user->setPassword($this->password);
        $user->generateAuthKey();
        $user->generateEmailVerificationToken();
        $user_saved = $user->save();
        if($user_saved) {
            $auth = Yii::$app->authManager;
            $authRole = $auth->getRole('author');
            $auth->assign($authRole, $user->getId());
            return $this->sendEmail($user);
        }
        return false;



       // return $user->save() && $this->sendEmail($user);
    }

    /**
     * Sends confirmation email to user
     * @param User $user user model to with email should be send
     * @return bool whether the email was sent
     */
    protected function sendEmail($user)
    {
        return Yii::$app
            ->mailer
            ->compose(
                ['html' => 'emailVerify-html', 'text' => 'emailVerify-text'],
                ['user' => $user]
            )
            //->setFrom([Yii::$app->params['supportEmail'] => Yii::$app->name . ' robot'])
            ->setFrom('tracingshare@yandex.ru')
            ->setTo($this->email)
            ->setSubject('Подтверждение регистрации ' . Yii::$app->name)
            ->send();
    }
}
