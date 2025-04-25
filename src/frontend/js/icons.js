export default {
	create(data, type = 'file', string = true) {
    /*data.color, data.width, data.height, data.class*/
    data.class = Array.isArray(data.class) ? data.class : []

    const icons = {
      arrow: `\
      <!--Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools-->\
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"\
        xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"\
        role="img" class="iconify iconify--emojione-monotone\
                          ${data.class.join(' ')}"\
                          preserveAspectRatio="xMidYMid meet"\
        width="${data.width}" fill="${data.color ?? 'white'}">\
        <path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2zm5.143\
                 28.305V49H26.857V30.305H16L32 15l16 15.305H37.143z">\
        </path>\
      </svg>`,
      file: `\
      <!-- Icons by Icons8: https://icons8.com/icon/kAH5EDO4t36D/file -->\
      <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"\
        class="${data.class.join(' ')}" width="${data.width}" height="${data.height}">\
        <path d="M4,19V5c0-1.657,1.343-3,3-3h7l6,6v11c0,1.657-1.343,3-3,3H7C5.343,22,4,20.657,4,19z"\
          fill="#36c8f6"/>\
        <path d="m14 6v-4l6 6h-4c-1.105 0-2-0.895-2-2z" fill="#2583ef"/>\
      </svg>`
    }

		const svg = icons[type] ?? icons['file']
		const div = document.createElement('div')
    div.innerHTML += svg

    return string
             ? svg
             : div.firstElementChild
	},
}

