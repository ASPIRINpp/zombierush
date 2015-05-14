<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru" lang="ru">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="language" content="ru" />
    <title>ZoombieRush</title>
    <link href="/assets/css/site.css" rel="stylesheet" media="all"/>
    <script type="text/javascript" src="/assets/js/core/core.js"></script>
</head>
<body>
        <div id="header" class="top">
            ZoombieRush
            | FPS: <span id="fps">50</span>
            | NPC: <span id="npcCount">0</span>
            | Money: <span id="moneyCount">0</span>
            | Life: <span id="lifeCount">0</span>
            | Kills: <span id="killsCount">0</span>
            | Next wave: <span id="waveCount">10</span>
            | <button id="bt1" title="Cost $200">T1</button>
            | <button id="bt2" title="Cost $300">T2</button>
            <button id="btPause">Pause</button>
        </div>
        <div id="content">
            <button style="min-width:100px; min-height: 60px; position: absolute; left: 350px; top: 240px;" id="startGame">Start game</button>
            <?php echo $content; ?>
        </div>

        <div id="footer">
            Coded by ASPIRIN++
            <span class="powerby">Powered by <a href="https://github.com/ASPIRINpp/krisphp" target="_blank">KrisPHP</a></span>
        </div>
        <script type="text/javascript" src="/assets/js/game.js"></script>
</body>
</html>
