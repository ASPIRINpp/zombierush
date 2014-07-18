<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="ru" />
        <title><?php echo CHtml::encode($this->pageTitle); ?></title>
        <style>
            body {padding: 0; margin: 0;}
            .top {
                min-width: 100%;
                position: absolute;
                top: 0;
                background: #000; /* Цвет фона */
                padding: 5px; /* Поля вокруг текста */
                opacity: 0.7; /* Полупрозрачный фон */
                filter: alpha(Opacity=70); /* Прозрачность в IE */
                color: #fff; /* Цвет текста */
            }
        </style>
    </head>

    <body>

        <div class="container" id="page">
            <div id="header" class="top">
                <?php echo CHtml::encode(Yii::app()->name); ?>
                | FPS: <span id="fps">50</span>
                | NPC: <span id="npcCount">0</span>
                <!--| <button id="addZombie">Add zombie</button>-->
                | <button id="waveZombie">New wave</button>
            </div><!-- header -->


            <?php echo $content; ?>

            <div class="clear"></div>

            <div id="footer">
                Coded by ASPIRIN++.<br/>
                <?php echo Yii::powered(); ?>
            </div><!-- footer -->

        </div><!-- page -->

    </body>
</html>
