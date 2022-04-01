<?php

namespace backend\models\user;

use Yii;
use yii\base\Model;
use common\models\User;

/**
 * Signup form
 */
class UpdateUserForm extends Model
{
    public $user_to_update;

    public $user_id;
    public $first_name;
    public $last_name;
    public $patronymic;
    public $email;
    public $password;
    public $role;

    const ROLE_AUTHOR = 'author';
    const ROLE_ADMIN = 'admin';

    public function __construct(User $user) {
        parent::__construct();
        $this->user_to_update = $user;
        $this->user_id = $user->id;
        $this->first_name = $user->first_name;
        $this->last_name = $user->last_name;
        $this->patronymic = $user->patronymic;
        $this->email = $user->email;
        $this->role = $user->getRole();
    }

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

           // ['password', 'required'],
            ['password', 'string'],

            [['first_name', 'last_name', 'patronymic'], 'required', 'message' => 'Это поле не может быть пустым'],
            [['first_name', 'last_name', 'patronymic'], 'string', 'min' => 2, 'max' => 32, 'message' => 'Максимальная длина: 32 символа'],

            ['role', 'in', 'range' => [self::ROLE_AUTHOR, self::ROLE_ADMIN],]
        ];
    }

    /**
     * Signs user up.
     *
     * @return bool whether the creating new account was successful and email was sent
     */
    public function update()
    {
        if (!$this->validate()) {
            return null;
        }

        //$user = new User();
        $this->user_to_update->first_name = $this->first_name;
        $this->user_to_update->last_name = $this->last_name;
        $this->user_to_update->patronymic = $this->patronymic;
        $this->user_to_update->email = $this->email;
        if(!empty($this->password)) {
            $this->user_to_update->setPassword($this->password);
        }
        //$user->status = User::STATUS_ACTIVE;
        $user_saved = $this->user_to_update->save();
        if($user_saved) {
            $auth = Yii::$app->authManager;
            //admin set the role
            $authRole = $auth->getRole($this->role);
            $auth->revokeAll($this->user_id);
            $auth->assign($authRole, $this->user_id);

            return true;
            //return $this->sendEmail($user);
        }
        return false;



       // return $user->save() && $this->sendEmail($user);
    }

    /**
     * Sends confirmation email to user
     * @param User $user user model to with email should be send
     * @return bool whether the email was sent
     */
    /*protected function sendEmail($user)
    {
        return Yii::$app
            ->mailer
            ->compose(
                ['html' => 'emailVerify-html', 'text' => 'emailVerify-text'],
                ['user' => $user]
            )
            ->setFrom([Yii::$app->params['supportEmail'] => Yii::$app->name . ' robot'])
            ->setTo($this->email)
            ->setSubject('Подтверждение регистрации ' . Yii::$app->name)
            ->send();
    }*/
}
