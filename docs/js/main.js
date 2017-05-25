jQuery(function ($) {

  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = $('.img-container');

  var image = container.find('img')[0]
  var actions = $('#actions');

  var options = {
    aspectRatio: 16 / 9,
    zoomable: true,
    viewMode: 1,
    preview: '.img-preview'
  };

  var cropper = new Cropper(image, options);
  var uploadedImageURL;

  // 需要设置选中状态
  actions.on("change", "input:radio", function (event) {

    var e = event || window.event;
    var target = $(this);

    if (!cropper) {
      return;
    }


    target.parents("label").addClass("active");
    target.parents("label").siblings().removeClass("active");
    // 修改对应的属性
    options[target.attr("name")] = target.attr("value");
    options.ready = function () {
      console.log('ready');
    }

    // 重建cropper
    cropper.destroy();
    cropper = new Cropper(image, options);
  });


  // Methods
  actions.on("click", "button.btn-primary", function (event) {
    console.info("click button.btn-primary");

    var e = event || window.event;
    var target = $(this);
    var result;
    var data;

    if (!cropper) {
      return;
    }

    if (target.hasClass("disabled")) {
      return;
    }

    data = {
      method: target.attr('data-method'),
      target: target.attr('data-target'),
      option: target.attr('data-option'),
      secondOption: target.attr('data-second-option')
    };

    if (data.method) {
      cropper[data.method](data.option, data.secondOption);
    }
  });

  // Import image
  var inputImage = $('#inputImage')[0];

  if (URL) {
    inputImage.onchange = function () {
      var files = this.files;
      var file;

      if (cropper && files && files.length) {
        file = files[0];

        if (/^image\/\w+/.test(file.type)) {
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          image.src = uploadedImageURL = URL.createObjectURL(file);
          cropper.destroy();
          cropper = new Cropper(image, options);
          inputImage.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    };
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  }


  $(".upload-cover").on("click", function () {
    var aspectRatio = parseFloat($("input[name=aspectRatio]").val());
    if (aspectRatio > 1) {
      var canvas = cropper.getCroppedCanvas({'width': 360, 'height': 202, fillColor: "#ffffff"});
    } else {
      var canvas = cropper.getCroppedCanvas({'width': 360, 'height': 360, fillColor: "#ffffff"});
    }

    $("#prev-image").attr("src", canvas.toDataURL());

  });
});


