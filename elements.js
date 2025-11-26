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
        desc: "星民天生就拥有与女神以及彼此的连结从而共享星祝的能力。在他们发现星祝的运作逻辑以后，星裔们相互团结，共同在星球上建造了几座高塔，作为星裔们共同连结的场所，由此集中和强化了连结网络。在高塔完成建造后，星民们围绕几座高塔，自发地形成了几大部落。"
    },  
    {
        src: "assets/music/The_Second_Starnucleus_Tower.mp3",
        desc: "北境的星核塔位于群山环绕的平原，它矗立于平原中央 ，如同王冠上的明珠，仿佛这片地貌就是为它而生。北境的星核塔由主副塔组成，其中主塔作为主要的连结场所和重要仪式集会的举办地主塔高耸挺拔，直入云天，总高约130米，塔基内径36米，外径45米，算上外延部分则长达65米。星核塔神圣而宏伟，充满了中世纪教会建筑和哥特式建筑的风格，更不必说洁白华丽的高塔内部，和星核塔中心的那个巨大、璀璨、圣洁的星核与星核基座。"
    },  
    {
        src: "assets/music/Astheral.mp3",   
        desc: "尽管星祝与女神的福泽同为女神撒播到卢瑟利恩的能量，但星祝是一种基于灵魂的能量传播，只有星裔能够接收，利用和辐射这种能量。灵魂的能量不会而由于传播而衰减，因此女神与星裔的连结是一种能量的双向传播，而星裔与星裔之间也可以进行相对微弱的星祝传播。星祝的传播逻辑可以用p2p网络类比，那么相应地，参与传输的星裔越多，星裔获取的星祝就越多。至于女神，作为最大的端口，她理所应当成为了产出和收入星祝最多的个体，可以说星裔的繁荣与女神的强盛是相辅相成的。"
    },
    {
        src: "assets/music/Nyxarion.mp3",
        desc: "这颗星球的体积远大于Luciarion，在漫长的岁月里经受了无数的陨石冲击与剧烈的地质运动，这使得它如同火球一般向外散发着热能和辐射。即使如同火球，和基于聚变供能的恒星比起来，它的能量微弱的如同一个会自发光的月亮。如果地球与月球的生态彼此互换，月球的居民遥望地球时，是否也会认为那是一颗巨大的月亮呢？"
    },
    {
        src: "assets/music/Iridis_Medusae_Vinum.mp3",
        desc: "它们可以毫不费力地漂浮在低空中，并像泰拉的水母那样上下飘动。虹树水母在休眠时会攀附在星云拱树上，在休眠期，它们的体内将收获的能量转化为一种香甜的液体，储存在体内以备不时之需。这种液体被星裔称为“水母酿”，星民通过刺激它们的触手可以促进虹树水母排出少量液体，因而水母酿成了星民们稀缺珍贵的饮品。"
    },
    {
        src: "assets/music/Zephyr_Leviathan.mp3",
        desc: "这种生物最神奇的是利用拉格朗日点漂浮在Lucarion本就稀薄的大气中，由于Luciarion和Nyxarion的重量和体积差异，双星的拉格朗日点位于离Luciarion很近的大气附近，因此云鲲就像是另一种天体或是云朵一样在luciarion的天空中。由于其巨大的体型，云鲲并不罕见，然而，这种生物的数量并不多，根据我们的估计，luciarion的云鲲数量大约在100~200只左右。"
    },
    {
        src: "assets/music/First_Sunrise.mp3",
        desc: "我的故乡永远被灿烂的繁星笼罩，那里并没有像太阳一样，可以照亮整片天空的天体。我一直以为只有那些冰冷遥远的光点才叫做恒星，从来没有想过它们可以如此温暖和光辉。原来那些东西看似冰冷，其实只不过是我离它太远。\n我也许终于找到了属于我的那颗星星呢..."
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
    // 初始化图片灯箱
    initLightbox();
});
