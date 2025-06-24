import { sha256 } from "js-sha256"
import plupload from "plupload"
import { formatSize } from "./utils"
import Icons from "./Components/Icons"
import FileEntry from "./Components/FileEntry"

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
passViewToggleHolder.innerHTML = Icons.create({width:'15px', height: '15px'}, 'eye')

passFieldHolderInHolder.classList.add('flex', 'items-center', 'border',
                                      'border-slate-500', 'border-solid',)
passFieldHolderInHolder.appendChild(passField)
passFieldHolderInHolder.appendChild(passViewToggleHolder)
passFieldHolder.appendChild(passFieldHolderInHolder)
passFieldHolder.appendChild(passButton)

passViewToggleHolder.addEventListener('click', function(event) {
  const iconPreset = {width: '15px', height: '15px'}
  if (passField.type == 'password') {
    passField.type = 'text'
    passViewToggleHolder.innerHTML = Icons.create(iconPreset, 'eyeBlind')
  } else {
    passField.type = 'password'
    passViewToggleHolder.innerHTML = Icons.create(iconPreset, 'eye')
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
  const response = await fetch('files', {
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

