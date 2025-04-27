import { sha256 } from "js-sha256"
import plupload from "plupload"
import Icons from './icons.js'

const fileInput         = document.querySelector('#file-input')
const fileListContainer = document.querySelector('#file-list')
const fileList          = document.querySelector('#file-list > ul')
const formFile          = document.querySelector('#form-file')

const passField  = document.createElement('input')
const passButton = document.createElement('input')
      
const passFieldHolder         = document.createElement('div')
const passViewToggleHolder    = document.createElement('div')
const passFieldHolderInHolder = document.createElement('div')

const meterElement = document.querySelector('section#meter')
const meterDesc    = document.querySelector('section#meter > p')
const meterBar     = document.querySelector('section#meter > div')

const plUploader = new plupload.Uploader({
  runtimes: 'html5',
  browse_button: 'file-input',
  url: '/files.php',
  chunk_size: '4mb',
  filters: {
    max_file_size: '500mb'
  },
  multipart: true,
  multipart_params: {
    fullSize: 'foo'
  }
})

const filesMap = {
  uploaded: Array(),
  staged: {
    entry: Array(),
    instance: Array(),
  }
}

let currentOnUploading = Object()

fileList.classList.add('text-white')
passField.type = 'password'
passField.id   = 'passfield'
passField.classList.add('text-white','outline-none', 'border-box',
                        'ml-1')
passButton.value = 'Log in'
passButton.type  = 'submit'
passButton.id    = 'loginButton'
passButton.classList.add('text-white', 'cursor-pointer',
                         'bg-gray-800', 'py-1', 'rounded-r-lg',
                         'border-t-1', 'border-r-1', 'border-b-1',
                         'border-gray-800', 'px-2')

passFieldHolder.id = 'passfield-holder'
passFieldHolder.classList.add('mt-5', 'flex')

passViewToggleHolder.id = 'passview-toggleholder'
passViewToggleHolder.classList.add('mx-1','p-1', 'hover:bg-gray-800', 'active:bg-gray-900',
                                   'cursor-pointer', 'rounded-md')
passViewToggleHolder.innerHTML = `\
  <svg width="15px" height="15px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"\
    fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 10c0-3.9 3.1-7 7-7s7\
    3.1 7 7h-1c0-3.3-2.7-6-6-6s-6 2.7-6 6H1zm4 0c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zm1\
    0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/>\
  </svg>`

passFieldHolderInHolder.classList.add('flex', 'items-center', 'border',
                                      'border-slate-500', 'border-solid',)
passFieldHolderInHolder.appendChild(passField)
passFieldHolderInHolder.appendChild(passViewToggleHolder)
passFieldHolder.appendChild(passFieldHolderInHolder)
passFieldHolder.appendChild(passButton)

passViewToggleHolder.addEventListener('click', function(event) {
  if (passField.type == 'password') {
    passField.type = 'text'
    passViewToggleHolder.innerHTML = `\
    <svg width="15px" height="15px" fill="#fff" version="1.1"\
      viewBox="0 0 3.9688 3.9688" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">\
      <g transform="translate(-24.89 -15)">\
        <g transform="matrix(.28348 0 0 .28348 24.607 14.717)">\
          <path transform="matrix(.075591 0 0 .075591 .062992 -3.2252)"\
            d="m186.23 206.53-163.47-116.77" stroke="#fff"\
            stroke-linecap="square" stroke-width="10.583"/>\
          <path d="m8 3c-3.9 0-7 3.1-7 7h1c0-3.3 2.7-6 6-6s6 2.7 6\
                   6h1c0-3.9-3.1-7-7-7zm0 4c-1.7 0-3 1.3-3\
                   3 0 1.7 1.3 3 3 3s3-1.3 3-3c0-1.7-1.3-3-3-3zm0\
                   1c1.1 0 2 0.9 2 2 0 1.1-0.9 2-2 2s-2-0.9-2-2c0-1.1\
                   0.9-2 2-2z"/>
        </g>
      </g>
    </svg>`
  } else {
    passField.type = 'password'
    passViewToggleHolder.innerHTML = `\
    <svg width="15px" height="15px" viewBox="0 0 16 16"\
      xmlns="http://www.w3.org/2000/svg" fill="#ffffff">\
      <path fill-rule="evenodd" clip-rule="evenodd"\
            d="M1 10c0-3.9 3.1-7 7-7s7 3.1 7\
               7h-1c0-3.3-2.7-6-6-6s-6 2.7-6 6H1zm4\
               0c0-1.7 1.3-3 3-3s3 1.3 3\
               3-1.3 3-3 3-3-1.3-3-3zm1\
               0c0 1.1.9 2 2 2s2-.9\
               2-2-.9-2-2-2-2 .9-2 2z"/>\
    </svg>`
  }

  passField.focus()
})

formFile.addEventListener('submit', event => {
  event.preventDefault()
  const submitterEl = event.submitter.id
  if(submitterEl == 'submitButton' && passField.parentNode){
    prompt()
    return
  }
  else if (doPass(passField.value)) {
    plUploader.start()
    return
  }

  window.alert('FAILED: refill the credentials')
})

plUploader.init()
plUploader.bind('FilesAdded', function(up, files) {
  uploadInstance = up

  if (fileListContainer.classList.contains('hidden')) {
    fileListContainer.classList.remove('hidden')
  }
  appendFilestoList(files, {
    width: '15px',
    height: '15px',
    class: ['transition-[transform]', 'fill-red-500']
  })
})
plUploader.bind('BeforeUpload', function(up, file) {
  // update status in the files list
  let targetIndex = filesMap.staged.instance.indexOf(file)

  currentOnUploading.item = filesMap.staged.entry[targetIndex]
  currentOnUploading.svg  = currentOnUploading
    .item // li >
    .children[0] // a >
    .children[1] // div >
    .children[0] // svg
  currentOnUploading.svg.classList.replace('fill-red-500', 'fill-purple-400')
})
plUploader.bind('FileUploaded', function (up, file) {
  // changing entry state
	currentOnUploading.svg.classList.replace('fill-purple-400', 'fill-green-400')
	currentOnUploading.svg.classList.toggle('transform-[rotate(.5turn)]')

  filesMap.uploaded.push(currentOnUploading.item[0])
  currentOnUploading = {}

})

plUploader.bind('Error', (up,error) => {
  console.log(error)
})
plUploader.bind('UploadComplete', updateState)
window.addEventListener('load', updateState)

function FileEntry(metadata, additionalData) {
  const divFoo = document.createElement('div')
  const svg = Icons.create(additionalData, 'arrow')
  divFoo.innerHTML = `\
  <li>
    <a href='/download.php?filename=${metadata.name}'
       class='flex w-[100%] p-1 overflow-hidden active:bg-gray-800
       hover:bg-gray-700 rounded-md cursor-pointer'>
      <div class='w-[100%] grow-1 shrink-1 flex overflow-hidden'>
        <section class='shrink-0 flex items-center mr-1'>
          ${Icons.create({
            height: '20px',
            width:  '20px',
            color: '#36c8f6'
          }, 'file')}
        </section>
        <section class='basis-[content] shrink-1 max-w-[74%]'>
          <p
            class='truncate cursor-text
                   text-nowrap break-keep'>${metadata.name}</p>
        </section>
        <section class='grow-1 shrink-0 ml-1'> <!-- -->
          <p class='text-right'>${formatSize(metadata.size)}</p>
        </section>
      </div>
      <div class='grow-0 shrink-0 flex items-center pl-1 arrow'>
        ${svg}
        <!--<svg fill="${metadata.uploaded ? '#3cde3e' : 'red'}" width="25px" height="25px"
             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"/>
        </svg> -->
      </div>
    </a>
  </li>`

  const liEl = divFoo.firstElementChild
  liEl.children[0].addEventListener('dragstart', event => event.preventDefault())

  return liEl
}

function formatSize(size, base = 2) { // base 2
  return size < base ** 10
    ? `${size} B`
    : size < base ** 20
    ? `${(size/base**10).toFixed(2)} KiB`
    : `${(size/base**20).toFixed(2)} MiB`
}

function doPass(password) {
  const pass = '93e3afc5cd5a969594deb2ecc3a9d1570252e28f14015cc91abf28180b6bb4d2'
  return sha256(password) === pass
}

// prompt password for login
function prompt() {
  formFile.appendChild(passFieldHolder)
  passField.focus()
}

async function updateState() {
  const response = await fetch('files.php', {
    headers: {
      'Accept': 'application/json',
    }
  })
  let jsonFilesList = await response.text();
  let filesList     = JSON.parse(jsonFilesList)
  removeAllChildNodes(fileList)
  removeFilesFromStage()
  appendFilestoList(filesList.files, {
    width:   '15px',  
    height:  '15px',  
    class: ['transform-[rotate(.5turn)]','fill-green-400',]
  })

  updateMeter({
    current: filesList.currentFolderSize,
    total: filesList.storageLimit
  })
}

function removeAllChildNodes(NodeObj)  {
  if (NodeObj.hasChildNodes()) {
    const entryList = Array.from(NodeObj.childNodes)
    entryList.forEach(entry => {
      NodeObj.removeChild(entry)
    })
  }
  filesMap.uploaded = Array()
  removeFilesFromStage()
}

function appendFilestoList(arrayOfFiles, adData) {
  // the *arrayOfFiles.file[n]*.uploaded property is useful here since
  // we never know where the object comes from so we can't assert if whether
  // it is the JSON from response or not
  for (let file of arrayOfFiles) {
    let node = FileEntry(file, adData)

    if (file.uploaded) {
      filesMap.uploaded.push(node)
    }
    else {
      filesMap.staged.instance.push(file)
      filesMap.staged.entry.push(node)
    }

    fileList.appendChild(node)
  }
  console.log(filesMap)
}

function isFileStaged(stagedFiles, toStageFile) {
  if (!stagedFiles.length) return
  
  return stagedFiles.includes(toStageFile)
}

function removeFilesFromStage() {
  if (!filesMap.staged.entry.length) return

  filesMap.staged.instance.forEach( item => {
    plUploader.removeFile(item)
  })

  filesMap.staged.instance = Array()
  filesMap.staged.entry    = Array()
}

function updateMeter(amount) {
  let percentage = Number(
    Math.ceil((amount.current / amount.total) * 100).toFixed(2)
  )
  meterDesc.innerHTML = `${formatSize(amount.current)}/${formatSize(amount.total)}`
  meterBar.style.width = `${percentage}%`
}
