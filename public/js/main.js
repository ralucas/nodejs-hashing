$(function() {

  function getVal(name, ref) {
    var selector = 'input[name="' + name + '"]';
    return ref.find(selector).val();
  }

  $('form').on('submit', function(e) {
    e.preventDefault();
    $this = $(this);
    var userData = {};
    
    // Let's hash the password here before sending over the wire
    var hashBitArray = sjcl.hash.sha256.hash($this.find('input[type="password"]').val());
    var hashedPw = sjcl.codec.hex.fromBits(hashBitArray);

    $this.find('input').each(function(idx, input) {
      var name = input.attr('name');
      userData[name] = getVal(name, $this); 
    });

    var endpoint = '/' + $this.attr('id');

    $.post(endpoint, userData, function(response) {
      console.log('response:', response);
    });
  });

});
