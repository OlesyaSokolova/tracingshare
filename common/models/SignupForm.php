<?php

namespace common\models;

use Yii;
use yii\base\Model;
/**
 * Signup form
 */
class SignupForm extends Model
{
    public $email;
    public $first_name;
    public $last_name;
    public $patronymic;
    public $password;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['email', 'trim'],
            [['email', 'first_name', 'last_name', 'patronymic'], 'required'],
            ['email', 'email'],
            ['email', 'string', 'max' => 255],
            ['email', 'unique', 'targetClass' => '\app\models\User', 'message' => 'Пользователь с таким email уже существует.'],
            ['password', 'required'],
            ['password', 'string', 'min' => 6, 'message' => 'Пароль должен содержать минимум 6 символов.']
        ];
    }

    /**
     * Signs user up.
     *
     * @return bool the saved model or null if saving fails
     */
    /*public function signup()
    {
        if (!$this->validate()) {
            return null;
        }

        $user = new User();
        $user->email = $this->email;
        $user->first_name = $this->first_name;
        $user->last_name = $this->last_name;
        $user->patronymic = $this->patronymic;
        $user->setPassword($this->password);
        $user->generateAuthKey();
        $user->save(false);

        $auth = Yii::$app->authManager;
        $authRole = $auth->getRole('author');
        $auth->assign($authRole, $user->getId());

        return $user;
    }*/

    public function validate($attributeNames = null, $clearErrors = true)
    {
        return parent::validate($attributeNames, $clearErrors);
    }
}
