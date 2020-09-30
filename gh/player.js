function gh_players(loop) {
    document.querySelectorAll("video.gh-player, audio.gh-player").forEach(loop)
}

function gh_preset() {
    gh_players(function(player) {
        player.controls = false
        player.autoplay = false
        player.loop = false
        player.muted = false
        player.preload = "metadata"
        // Interesting fact about "metadata" preload:
        // meta information is always fetched after(!) the source has been loaded
        // browsers treat this setting almost identical to "auto"
        // concluding, a value of "none" would never have access to source .duration

        player.addEventListener("loadedmetadata", function(event) {
            console.log("loadedmeta", event.target, event.target.currentTime)
        })

        player.addEventListener("durationchange", function(event) {
            console.log("durationchange", event.target, event.target.currentTime)
        })

        player.addEventListener("loadeddata", function(event) {
            console.log("dataloaded", event.target, event.target.currentTime)
        })

        player.addEventListener("canplay", function(event) {
            console.log("canplay", event.target, event.target.currentTime)
        })

        player.addEventListener("loadstart", function(event) {
            player.currentTime = 0.001 // request first-frame preview
            console.log("loadstart!!!", event.target, event.target.currentTime)
        })
        
    })
}


addEventListener("DOMContentLoaded", function() {
    gh_preset()
})

addEventListener("load", function() {
    gh_players(function(player) {
        player.load()
    })
})
