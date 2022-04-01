<?php

use yii\db\Migration;

/**
 * Handles adding columns to table `{{%exibits}}`.
 */
class m220305_145239_add_thumbnail_column_to_exibits_table extends Migration
{
    public function up()
    {
        $this->addColumn('{{%publication}}', 'thumbnail', $this->string()->defaultValue(null));
    }

    public function down()
    {
        $this->dropColumn('{{%publication}}', 'thumbnail');
    }
}
