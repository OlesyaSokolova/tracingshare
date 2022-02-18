<?php

namespace app\commands;

use app\models\OwnerRule;
use Yii;
use yii\console\Controller;

class RbacController extends Controller
{
    public function actionInit()
    {
        $auth = Yii::$app->authManager;
        $auth->removeAll();

        // добавляем разрешение "createPost"
        $createPost = $auth->createPermission('createPost');
        $createPost->description = 'Создать публикацию';
        $auth->add($createPost);

        // добавляем разрешение "updatePost"
        $updatePost = $auth->createPermission('updatePost');
        $updatePost->description = 'Редактировать публикацию';
        $auth->add($updatePost);

        // добавляем разрешение "updateOwnPost"
        //1. Создаем новое правило
        $ruleCheckOwner = new OwnerRule();
        $auth->add($ruleCheckOwner);
        //2. Создаем разрешение
        $updateOwnPost = $auth->createPermission('updateOwnPost');
        $updateOwnPost->description = 'Редактировать собственную публикацию.';
        $updateOwnPost->ruleName = $ruleCheckOwner->name;
        $auth->add($updateOwnPost);

        // "updateOwnPost" будет использоваться из "updatePost"
        $auth->addChild($updateOwnPost, $updatePost);

        // добавляем разрешение "updateUserInfo"
        $updateUserInfo = $auth->createPermission('updateUserInfo');
        $updateUserInfo->description = 'Редактировать данные о пользователе';
        $auth->add($updateUserInfo);

        //добавляем роль "author" и даём роли разрешение "createPost" и "updateOwnPost"
        $author = $auth->createRole('author');
        $auth->add($author);
        $auth->addChild($author, $updateOwnPost);

        //добавляем роль "admin" и даём роли разрешение "updatePost"
        //а также все разрешения роли "author"
        $admin = $auth->createRole('admin');
        $auth->add($admin);
        $auth->addChild($admin, $updateUserInfo);
        $auth->addChild($admin, $updatePost);
        $auth->addChild($admin, $author);

// Назначение ролей пользователям. 1 и 7 это IDs возвращаемые IdentityInterface::getId()
// обычно реализуемый в модели User.
        $auth->assign($author, 16);
        $auth->assign($admin, 18);
    }
}
