<?php

namespace common\models;

use yii\rbac\Item;
use yii\rbac\Rule;

class OwnerRule extends Rule
{
    public $name = 'isOwner';

    /**
     * Проверка авторства публикации.
     *
     * @param string|int $userId  Идентификатор пользователя.
     * @param Item       $item   Роль или разрешение ассоциированное с этим правилом.
     * @param array      $params Параметры.
     *
     * @return bool Результат проверки, вернет true или false.
     */
    public function execute($userId, $item, $params)
    {
        if (!isset($params['publication'])) {
            return false;
        }

        return $params['publication']->author_id == $userId;
    }
}
