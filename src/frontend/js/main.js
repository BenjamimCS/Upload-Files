import { sha256 } from "js-sha256"
import plupload from "plupload"
import { formatSize } from "./utils"
import Icons from "./Components/Icons"
import AlertBox  from "./Components/AlertBox"
import FileEntry from "./Components/FileEntry"
import Login from "./Components/Login"

const fileDialogButton  = document.querySelector('#file-dialog-btn')
const fileListContainer = document.querySelector('#file-list')
const fileList          = document.querySelector('#file-list > ul')
const formFile          = document.querySelector('#form-file')
const loginField        = new Login(formFile)

const meterElement = document.querySelector('section#meter')
const meterDesc    = document.querySelector('section#meter > p')
const meterBar     = document.querySelector('section#meter > div')
const invalidCredentialsBox = new AlertBox('Invalid credentials.',
                                           meterElement.parentElement,
                                           'error')

const plUploader = new plupload.Uploader({
  runtimes: 'html5',
  browse_button: fileDialogButton,
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

