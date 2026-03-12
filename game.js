function updateSnakeState(state) {
    snakeGameState = state;
    
    // Update score display (my score)
    const myPlayer = state.players.find(p => p.id === socket.id);
    if (myPlayer) {
        document.getElementById('snakeScore').textContent = myPlayer.score;
    }
    
    // Update player list with alive status
    const playersEl = document.getElementById('snakePlayers');
    playersEl.innerHTML = state.players.map((p, i) => {
        const color = ['#00ff88', '#ff6b6b', '#00ccff', '#ffd700', '#ffaa00'][i % 5];
        return `<span style="padding: 4px 8px; background: ${p.alive ? color : 'rgba(255,255,255,0.1)'}; border-radius: 12px; font-size: 0.9rem;">
            ${p.username} ${p.alive ? '🟢' : '💀'} (${p.score})
        </span>`;
    }).join('');
    
    drawMultiSnake(state);
}

function drawMultiSnake(state) {
    // Clear canvas
    snakeCtx.fillStyle = '#0a0a1a';
    snakeCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Grid
    snakeCtx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < TILE_COUNT; i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(i * GRID_SIZE, 0);
        snakeCtx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
        snakeCtx.stroke();
        snakeCtx.beginPath();
        snakeCtx.moveTo(0, i * GRID_SIZE);
        snakeCtx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
        snakeCtx.stroke();
    }
    
    // Shared food
    if (state.food) {
        snakeCtx.fillStyle = '#ff6b6b';
        snakeCtx.shadowColor = '#ff6b6b';
        snakeCtx.shadowBlur = 20;
        snakeCtx.beginPath();
        snakeCtx.arc(
            state.food.x * GRID_SIZE + GRID_SIZE / 2,
            state.food.y * GRID_SIZE + GRID_SIZE / 2,
            GRID_SIZE / 2 - 1,
            0,
            Math.PI * 2
        );
        snakeCtx.fill();
        snakeCtx.shadowBlur = 0;
    }
    
    // All snakes
    Object.entries(state.snakes).forEach(([playerId, snakeSegments], playerIndex) => {
        const player = state.players.find(p => p.id === playerId);
        const isMe = playerId === socket.id;
        const colors = [
            '#00ff88', '#ff6b6b', '#00ccff', '#ffd700', '#ffaa00',
            '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#88ff00'
        ];
        const baseColor = colors[playerIndex % colors.length];
        const headColor = isMe ? '#ffffff' : baseColor;
        
        snakeSegments.forEach((seg, segIndex) => {
            const isHead = segIndex === 0;
            snakeCtx.fillStyle = player?.alive ? 
                (isHead ? headColor : baseColor) : 
                'rgba(128,128,128,0.6)';
            
            snakeCtx.shadowColor = snakeCtx.fillStyle;
            snakeCtx.shadowBlur = isHead ? 15 : 5;
            
            snakeCtx.beginPath();
            snakeCtx.roundRect(
                seg.x * GRID_SIZE + 1,
                seg.y * GRID_SIZE + 1,
                GRID_SIZE - 2,
                GRID_SIZE - 2,
                4
            );
            snakeCtx.fill();
            snakeCtx.shadowBlur = 0;
        });
    });
}
