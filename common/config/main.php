<?php
return [
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'vendorPath' => dirname(dirname(__DIR__)) . '/vendor',
    'components' => [
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'authManager' => [
            'class' => 'yii\rbac\DbManager',
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => true,
            //'enableStrictParsing' => false,
            'rules' => [
            ],
        ],
       /* 'user' => [
            'class' => 'common\models\User',
            'identityClass' => 'common\models\User',
        ],*/
    ],
];
