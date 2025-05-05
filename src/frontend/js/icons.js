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
      </svg>`,
      eye: `\
      <svg width="${data.width}" height="${data.height}" viewBox="0 0 16 16"\
        xmlns="http://www.w3.org/2000/svg" fill="#ffffff" class="${data.class.join(' ')}">\
        <path fill-rule="evenodd" clip-rule="evenodd"\
              d="M1 10c0-3.9 3.1-7 7-7s7 3.1 7\
                 7h-1c0-3.3-2.7-6-6-6s-6 2.7-6 6H1zm4\
                 0c0-1.7 1.3-3 3-3s3 1.3 3\
                 3-1.3 3-3 3-3-1.3-3-3zm1\
                 0c0 1.1.9 2 2 2s2-.9\
                 2-2-.9-2-2-2-2 .9-2 2z"/>\
      </svg>`,
      eyeBlind: `\
      <svg width="${data.width}" height="${data.height}" fill="#ffffff" version="1.1"
        viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="${data.class.join(' ')}">\
        <path d="m1 10c0-3.9 3.1-7 7-7s7 3.1 7 7h-1c0-3.3-2.7-6-6-6s-6\
        2.7-6 6zm4 0c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zm1\
        0c0 1.1 0.9 2 2 2s2-0.9 2-2-0.9-2-2-2-2 0.9-2 2z" clip-rule="evenodd"\
        fill-rule="evenodd"/>\
        <path d="m2.5532 2.5532 10.894 10.894" fill="#fff" stroke="#fff"\
          stroke-linecap="square" stroke-width="1.0406"/>\
      </svg>`,
    }

		const svg = icons[type] ?? icons['file']
		const div = document.createElement('div')
    div.innerHTML += svg

    return string
             ? svg
             : div.firstElementChild
	},
}

