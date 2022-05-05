<?php

namespace common\models;

use Yii;

class UrlUtils
{
    public static function getFirstPartOfUrl() {
        $projectFolder = basename(Yii::getAlias('@root'));
        if(isset($_SERVER['HTTPS'])){
            $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
        }
        else{
            $protocol = 'http';
        }
        return $protocol . "://" . $_SERVER['HTTP_HOST'] . "/". $projectFolder;
    }

    public static function frontendUrl()
    {
        return self::getFirstPartOfUrl()."/frontend/web/index.php";
    }

    public static function backendUrl()
    {
        return self::getFirstPartOfUrl()."/backend/web/index.php";
    }
}
