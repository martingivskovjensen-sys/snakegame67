function spawnSnakeFood(room) {
    const gs = room.gameState;
    do {
        gs.food = {
            x: Math.floor(Math.random() * gs.gridSize),
            y: Math.floor(Math.random() * gs.gridSize)
        };
    } while (Object.values(gs.snakes).some(snake => 
        snake.some(seg => seg.x === gs.food.x && seg.y === gs.food.y)
    ));
}
