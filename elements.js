// 页面切换逻辑
function switchPage(pageId, btnElement) {
    // 1. 隐藏所有页面
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 2. 显示目标页面
    const targetPage = document.getElementById(pageId);
    if(targetPage) {
        targetPage.classList.add('active');
    }

    // 3. 更新按钮状态
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    btnElement.classList.add('active');

    // 4. 更新背景图
    // 获取按钮上的 data-bg 属性
    const newBg = btnElement.getAttribute('data-bg');
    if (newBg) {
        // 设置 CSS 变量，驱动 .trapezoid-mask 的背景变化
        document.documentElement.style.setProperty('--content-bg-image', newBg);
    }
}

// --- Lightbox (大图查看) 逻辑 ---
let zoomLevel = 1;
let isDragging = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;

function initLightbox() {
    // 选取所有 asset-card 下的图片
    const assetImages = document.querySelectorAll('.asset-card .card-media img');
    assetImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.onclick = function(e) {
            e.stopPropagation();
            openLightbox(this.src);
        }
    });

    const lightboxImg = document.getElementById('lightboxImage');
    
    // 滚轮缩放
    if (lightboxImg) {
        lightboxImg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const scaleAmount = 0.1;
            if (e.deltaY < 0) {
                zoomLevel += scaleAmount;
            } else {
                zoomLevel -= scaleAmount;
            }
            // 限制缩放范围 0.5x ~ 15x
            zoomLevel = Math.min(Math.max(0.5, zoomLevel), 15);
            updateTransform();
        });

        // 双击还原/放大
        lightboxImg.addEventListener('dblclick', (e) => {
            e.preventDefault();
            if (zoomLevel !== 1) {
                resetZoom();
            } else {
                zoomLevel = 2; // 双击放大2倍
                updateTransform();
                lightboxImg.style.cursor = 'grab';
            }
        });

        // 拖拽逻辑
        lightboxImg.addEventListener('mousedown', (e) => {
            if(zoomLevel > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                lightboxImg.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });
    }

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        if(isDragging) {
            isDragging = false;
            if (lightboxImg) lightboxImg.style.cursor = zoomLevel > 1 ? 'grab' : 'zoom-in';
        }
    });
}

function updateTransform() {
    const img = document.getElementById('lightboxImage');
    if (img) img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
}

function resetZoom() {
    zoomLevel = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
    const img = document.getElementById('lightboxImage');
    if(img) img.style.cursor = 'zoom-in';
}

function openLightbox(src) {
    const modal = document.getElementById('imageLightbox');
    const modalImg = document.getElementById('lightboxImage');
    if (modal) modal.style.display = "flex";
    if (modalImg) {
        modalImg.src = src;
        resetZoom();
    }
}

function closeLightbox() {
    const modal = document.getElementById('imageLightbox');
    if (modal) modal.style.display = "none";
    setTimeout(() => {
            const modalImg = document.getElementById('lightboxImage');
            if(modalImg) modalImg.src = "";
            resetZoom();
    }, 200);
}

// --- 音乐播放器逻辑 ---
// 请在这里配置你的音乐文件路径
// 注意：为了读取 MP3 元数据，请使用 Live Server 运行或部署到服务器，直接双击打开 HTML 可能因浏览器安全策略无法读取。
const musicData = [
    {
        src: "assets/music/Starborn_of_Luciarion.mp3",
        desc: "The Starborn are naturally endowed with a connection to the Goddess and to each other, allowing them to share the 'Astheral'. After discovering the logic behind this energy, the Starborns united to build several towers on the planet. These towers serve as communal connection hubs, concentrating and strengthening the network. Upon completion, the Starborn spontaneously formed major tribes around these towers."
    },  
    {
        src: "assets/music/The_Second_Starnucleus_Tower.mp3",
        desc: "The Starnucleus Tower of the North stands in a plain surrounded by mountains. Like a jewel in a crown, the landscape seems created for it. Comprising a main and secondary tower, it serves as the primary connection site and venue for important rituals. The main tower soars 130 meters into the sky, with a style reminiscent of medieval ecclesiastical and Gothic architecture. Inside, it is pristine and magnificent, housing the massive, radiant, and holy Starnucleus at its center."
    },  
    {
        src: "assets/music/Astheral.mp3",   
        desc: "Although the 'Astheral' and the 'Goddess's Grace' are both energies disseminated by the Goddess to Luciarion, the Astheral is soul-based. Only the Starborns can receive, utilize, and radiate this energy. Soul energy does not decay with transmission; thus, the connection is a two-way flow. The propagation logic is analogous to a P2P network: the more Starborns participate, the more energy they receive. As the largest node, the Goddess naturally produces and receives the most energy—the prosperity of the Starborns and the power of the Goddess are mutually reinforcing."
    },
    {
        src: "assets/music/Nyxarion.mp3",
        desc: "This planet is far larger than Luciarion. Over eons, it has withstood countless meteorite impacts and violent geological movements, radiating heat and radiation like a fireball. Yet, compared to a fusion-powered star, its energy is as faint as a self-luminous moon. If the ecosystems of the Earth (Earth) and Luna (Moon) were swapped, would the inhabitants of the moon look at Earth and consider it just a giant moon?"
    },
    {
        src: "assets/music/Iridis_Medusae_Vinum.mp3",
        desc: "These creatures float effortlessly in the low altitude, drifting up and down like jellyfish on the Earth. The 'Iridis Medusae' attach themselves to Nebula Arch-Trees during dormancy. In this phase, they convert harvested energy into a sweet liquid stored within their bodies. Known to the Starborns as 'Iridis Medusae Vinum', this scarce and precious beverage can be harvested in small amounts by stimulating their tentacles."
    },
    {
        src: "assets/music/Zephyr_Leviathan.mp3",
        desc: "The most amazing feature of the Zephyr Leviathan is its ability to use Lagrange points to float in Luciarion's thin atmosphere. Due to the mass and volume difference between the twin stars, the Lagrange point lies very close to Luciarion's atmosphere. Thus, these leviathans act like celestial bodies or living clouds in the sky. Despite their massive size making them easy to spot, they are rare; we estimate there are only about 100-200 of them on Luciarion."
    },
    {
        src: "assets/music/First_Sunrise.mp3",
        desc: "My homeland is forever shrouded in brilliant stars, but there is no celestial body like the sun to illuminate the entire sky. I always thought only those cold, distant points of light were called 'stars'. I never imagined they could be so warm and radiant. Perhaps those things seemed cold simply because I was too far away. Maybe I have finally found the star that belongs to me..."
    },
    {
        src: "assets/music/What Are You Thinking About, Ta Chan.mp3",
        desc: "Ta Chan, Ta Chan... Bearing hatred that doesn't belong to you, carrying expectations that aren't yours to fulfill—how will you ever find your way out of this endless path of revenge?"
    }
];

let currentTrackIndex = 0;
const audioPlayer = document.getElementById('audioPlayer');
const vinylDisc = document.getElementById('vinylDisc');
const playBtn = document.getElementById('playPauseBtn');

// 缓存已读取的元数据，避免重复读取
const metadataCache = new Map();

function initPlayer() {
    // 先渲染一个初始列表（显示文件名或加载中）
    renderPlaylist();
    // 尝试加载第一首歌
    loadTrack(0);
    // 异步加载所有歌曲的元数据并刷新列表
    loadAllMetadata();
}

function loadAllMetadata() {
    musicData.forEach((track, index) => {
        fetchMetadata(track.src, (data) => {
            // 将读取到的数据存入 track 对象
            musicData[index] = { ...musicData[index], ...data };
            // 刷新列表显示
            updatePlaylistItem(index);
            // 如果当前正在播放这首歌，更新播放器界面
            if (index === currentTrackIndex) {
                updatePlayerUI(index);
            }
        });
    });
}

function fetchMetadata(url, callback) {
    // 关键修复：虽然播放器可以使用相对路径，但 jsmediatags 库在读取文件时，
    // 如果不使用完整的绝对路径 (http://...), 可能会因为路径解析问题导致读取失败。
    // 这里我们在内部自动转换，不影响你上面的配置。
    const absoluteUrl = new URL(url, window.location.href).href;

    if (metadataCache.has(absoluteUrl)) {
        callback(metadataCache.get(absoluteUrl));
        return;
    }

    // 使用 jsmediatags 读取
    if (window.jsmediatags) {
        window.jsmediatags.read(absoluteUrl, {
            onSuccess: function(tag) {
                const tags = tag.tags;
                let coverUrl = "";
                
                // 处理封面图片
                if (tags.picture) {
                    const { data, format } = tags.picture;
                    let base64String = "";
                    for (let i = 0; i < data.length; i++) {
                        base64String += String.fromCharCode(data[i]);
                    }
                    coverUrl = `data:${format};base64,${window.btoa(base64String)}`;
                }

                const metadata = {
                    title: tags.title || url.split('/').pop(), // 没标题就用文件名
                    artist: tags.artist || "Unknown Artist",
                    album: tags.album || "Unknown Album",
                    cover: coverUrl
                };
                
                metadataCache.set(absoluteUrl, metadata);
                callback(metadata);
            },
            onError: function(error) {
                console.warn("读取元数据失败:", url, error);
                // 失败时的默认值
                const fallback = {
                    title: url.split('/').pop().replace(/%20/g, " "), // 解码文件名
                    artist: "Unknown Artist",
                    album: "Unknown Album",
                    cover: "" 
                };
                callback(fallback);
            }
        });
    } else {
        // Fallback if jsmediatags is not loaded
        const fallback = {
            title: url.split('/').pop().replace(/%20/g, " "),
            artist: "Unknown Artist",
            album: "Unknown Album",
            cover: "" 
        };
        callback(fallback);
    }
}

function renderPlaylist() {
    const list = document.getElementById('playlist');
    if(!list) return;
    list.innerHTML = '';
    musicData.forEach((track, index) => {
        const item = document.createElement('div');
        item.id = `playlist-item-${index}`;
        item.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
        item.onclick = () => playTrack(index);
        // 初始状态，可能还没有元数据
        const displayTitle = track.title || "Loading...";
        const displayArtist = track.artist || "...";
        
        item.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-weight:bold; width:20px;">${index + 1}</span>
                <div style="display:flex; flex-direction:column;">
                    <span class="item-title" style="font-weight:600;">${displayTitle}</span>
                    <span class="item-artist" style="font-size:0.8rem; opacity:0.7;">${displayArtist}</span>
                </div>
            </div>
            <span class="playing-icon">♫</span>
        `;
        list.appendChild(item);
    });
}

function updatePlaylistItem(index) {
    const item = document.getElementById(`playlist-item-${index}`);
    if (item && musicData[index].title) {
        item.querySelector('.item-title').innerText = musicData[index].title;
        item.querySelector('.item-artist').innerText = musicData[index].artist;
    }
}

function loadTrack(index) {
    currentTrackIndex = index;
    const track = musicData[index];
    
    // 如果元数据还没加载完，先显示默认信息，等 loadAllMetadata 回调来更新
    updatePlayerUI(index);

    if(audioPlayer) audioPlayer.src = track.src;
    
    // 更新列表选中状态
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, i) => {
        if(i === index) item.classList.add('active');
        else item.classList.remove('active');
    });
}

function updatePlayerUI(index) {
    const track = musicData[index];
    const titleEl = document.getElementById('currentTitle');
    const artistEl = document.getElementById('currentArtist');
    const albumEl = document.getElementById('currentAlbum');
    const descEl = document.getElementById('currentDesc');
    const coverDiv = document.getElementById('vinylCover');

    if (track.title) {
        if(titleEl) titleEl.innerText = track.title;
        if(artistEl) artistEl.innerText = track.artist;
        if(albumEl) albumEl.innerText = track.album;
        
        if(coverDiv) {
            if(track.cover && track.cover !== "") {
                coverDiv.style.backgroundImage = `url('${track.cover}')`;
            } else {
                // 默认封面颜色或图片
                coverDiv.style.backgroundImage = 'none';
                coverDiv.style.backgroundColor = '#7e46ff';
            }
        }
    } else {
        // 还在加载中
        if(titleEl) titleEl.innerText = "Loading Metadata...";
        if(artistEl) artistEl.innerText = "Please wait";
        if(albumEl) albumEl.innerText = "";
    }
    
    // 描述是手动配置的，总是存在
    if(descEl) descEl.innerText = track.desc || "暂无介绍";
}

function playTrack(index) {
    if(index !== currentTrackIndex) {
        loadTrack(index);
    }
    togglePlay(true);
}

function togglePlay(forcePlay = false) {
    if(!audioPlayer) return;
    if (audioPlayer.paused || forcePlay) {
        audioPlayer.play().catch(e => console.log("Audio play failed (interaction needed):", e));
        if(vinylDisc) vinylDisc.classList.add('playing');
        if(playBtn) playBtn.innerText = "||"; // 暂停符号
    } else {
        audioPlayer.pause();
        if(vinylDisc) vinylDisc.classList.remove('playing');
        if(playBtn) playBtn.innerText = "▶"; // 播放符号
    }
}

function playNext() {
    let nextIndex = (currentTrackIndex + 1) % musicData.length;
    playTrack(nextIndex);
}

// --- 音频互斥控制逻辑 ---
// 1. 加载 YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytPlayer;
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    // 当 YouTube 开始播放时 (PLAYING = 1)
    if (event.data == YT.PlayerState.PLAYING) {
        stopAllAudio('youtube');
    }
}

// 2. 监听本地视频播放
const localVideos = document.querySelectorAll('.interactive-video');
localVideos.forEach(video => {
    video.addEventListener('play', (e) => {
        stopAllAudio('video', e.target);
    });
});

// 3. 监听音乐播放器播放
// 注意：audioPlayer 已经在上面定义了
if(audioPlayer) {
    audioPlayer.addEventListener('play', () => {
        stopAllAudio('music');
    });
}

// 4. 统一停止函数
function stopAllAudio(source, specificVideoElement = null) {
    // 如果来源不是音乐，且音乐正在播放，则暂停音乐
    if (source !== 'music' && audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        // 同步更新 UI 状态
        if(vinylDisc) vinylDisc.classList.remove('playing');
        if(playBtn) playBtn.innerText = "▶";
    }

    // 如果来源不是 YouTube，且 YouTube 播放器已就绪，则暂停 YouTube
    if (source !== 'youtube' && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        // 检查状态，如果是播放或缓冲中，则暂停
        // YT.PlayerState.PLAYING = 1, YT.PlayerState.BUFFERING = 3
        var state = ytPlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
            ytPlayer.pauseVideo();
        }
    }

    // 如果来源不是本地视频，或者来源是本地视频但不是当前这个，则暂停
    const localVideos = document.querySelectorAll('.interactive-video');
    localVideos.forEach(video => {
        // 如果来源不是 'video'，暂停所有视频
        // 如果来源是 'video'，暂停除了 specificVideoElement 之外的所有视频
        if (source !== 'video' || (source === 'video' && video !== specificVideoElement)) {
            if (!video.paused) {
                video.pause();
            }
        }
    });
}

// --- 进度条控制逻辑 ---
const progressBarWrapper = document.getElementById('progressBarWrapper');
const progressBarFill = document.getElementById('progressBarFill');
const progressHandle = document.getElementById('progressHandle');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

let isDraggingProgress = false;

function initProgressBar() {
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('loadedmetadata', () => {
            if(durationEl) durationEl.innerText = formatTime(audioPlayer.duration);
        });
    }

    if (progressBarWrapper) {
        progressBarWrapper.addEventListener('click', (e) => {
            if (!audioPlayer) return;
            const rect = progressBarWrapper.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (isFinite(audioPlayer.duration)) {
                audioPlayer.currentTime = pos * audioPlayer.duration;
            }
        });

        progressBarWrapper.addEventListener('mousedown', (e) => {
            isDraggingProgress = true;
            updateDrag(e);
            document.addEventListener('mousemove', updateDrag);
            document.addEventListener('mouseup', stopDrag);
        });
        
        progressBarWrapper.addEventListener('touchstart', (e) => {
            isDraggingProgress = true;
            updateDrag(e.touches[0]);
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', stopDrag);
        });
    }
}

function onTouchMove(e) {
    e.preventDefault();
    updateDrag(e.touches[0]);
}

function updateDrag(e) {
    if (!isDraggingProgress || !audioPlayer) return;
    const rect = progressBarWrapper.getBoundingClientRect();
    let pos = (e.clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));
    
    const percentage = pos * 100;
    if(progressBarFill) progressBarFill.style.width = percentage + '%';
    if(progressHandle) progressHandle.style.left = percentage + '%';
    
    if(currentTimeEl && isFinite(audioPlayer.duration)) {
        currentTimeEl.innerText = formatTime(pos * audioPlayer.duration);
    }
}

function stopDrag(e) {
    if (isDraggingProgress && audioPlayer) {
        isDraggingProgress = false;
        document.removeEventListener('mousemove', updateDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', stopDrag);
        
        const rect = progressBarWrapper.getBoundingClientRect();
        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        
        let pos = (clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos));
        if (isFinite(audioPlayer.duration)) {
             audioPlayer.currentTime = pos * audioPlayer.duration;
        }
    }
}

function updateProgress() {
    if (isDraggingProgress || !audioPlayer) return;
    
    const current = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (isFinite(duration)) {
        const percentage = (current / duration) * 100;
        if(progressBarFill) progressBarFill.style.width = percentage + '%';
        if(progressHandle) progressHandle.style.left = percentage + '%';
        if(currentTimeEl) currentTimeEl.innerText = formatTime(current);
        if(durationEl) durationEl.innerText = formatTime(duration);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// 初始化：页面加载时应用默认激活按钮的背景
document.addEventListener('DOMContentLoaded', () => {
    const activeBtn = document.querySelector('.nav-btn.active');
    if(activeBtn) {
        const bg = activeBtn.getAttribute('data-bg');
        if(bg) {
            document.documentElement.style.setProperty('--content-bg-image', bg);
        }
    }
    // 初始化播放器
    initPlayer();
    // 初始化进度条
    initProgressBar();
    // 初始化图片灯箱
    initLightbox();
});
